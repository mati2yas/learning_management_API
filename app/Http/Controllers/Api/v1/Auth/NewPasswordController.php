<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendCustomPasswordResetEmail;
use App\Jobs\SendCustomVerificationEmail;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class NewPasswordController extends Controller
{
    public function forgotPassword(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email address.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if the email exists in the database
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email not found in our records.',
                'errors' => [
                    'email' => 'Email not found in our records.'
                ]
            ], 404);
        }

        // Password::sendResetLink(
        //     $request->only('email')
        // );

        SendCustomPasswordResetEmail::dispatch($user);

        return response()->json([
            'status' => 'Success',
            'message' => 'You will receive a password reset link shortly.'
        ]);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required',
            'password' => ['required', 'confirmed',],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                $user->tokens()->delete();

                dispatch(function()use($user){
                    event(new PasswordReset($user));
                });

            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json([
                'message'=> 'Password reset successfully'
            ]);
        }

        return response()->json([
            'message'=> __($status)
        ], 500);

    }
}

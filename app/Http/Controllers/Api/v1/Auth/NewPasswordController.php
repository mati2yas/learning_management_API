<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendCustomPasswordResetEmail;
use App\Jobs\SendCustomVerificationEmail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        SendCustomPasswordResetEmail::dispatch($user);

        // $token = Password::createToken($user);

        // return response()->json([
        //     'status' => 'Success',
        //     'token' => $token
        // ], 200);



        return response()->json([
            'status' => 'Success',
            'message' => 'You will receive a PIN shortly.'
        ]);
    }

    // public function reset(Request $request)
    // {
    //     $request->validate([
    //         'token' => 'required',
    //         'email' => 'required|email',
    //         'password' => ['required', 'confirmed'],
    //     ]);
    
    //     $user = null; // Declare user variable
    
    //     $status = Password::reset(
    //         $request->only('email', 'password', 'password_confirmation', 'token'),
    //         function ($resetUser) use ($request, &$user) { // Pass $user by reference
    //             $resetUser->forceFill([
    //                 'password' => Hash::make($request->password),
    //                 'remember_token' => Str::random(60),
    //             ])->save();
    
    //             $resetUser->tokens()->delete(); // Delete old tokens
    
    //             dispatch(function () use ($resetUser) {
    //                 event(new PasswordReset($resetUser));
    //             });
    
    //             $user = $resetUser; // Assign the user
    //         }
    //     );
    
    //     if ($status == Password::PASSWORD_RESET && $user) {
    //         return response()->json([
    //             'message' => 'Password reset successfully',
    //             'token' => $user->createToken("API TOKEN")->plainTextToken, // Generate token
    //             'data' => ['user' => $user],
    //         ]);
    //     }
    
    //     return response()->json([
    //         'message' => __($status),
    //     ], 500);
    // }


    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'pin' => 'required|digits:6',
            'password' => 'required|min:8|confirmed',
        ]);

        // Get PIN record from DB
        $pinRecord = DB::table('password_resets')->where('email', $request->email)->first();

        // Validate PIN
        if (!$pinRecord || $pinRecord->pin != $request->pin) {
            return response()->json(['message' => 'Invalid PIN'], 400);
        }

        // Check expiration time
        if (Carbon::now()->gt($pinRecord->expires_at)) {
            return response()->json(['message' => 'PIN has expired'], 400);
        }

        // Reset password
        $user = User::where('email', $request->email)->firstOrFail();
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the used PIN
        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password reset successful']);
    }
    
}

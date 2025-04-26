<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

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


        $pin = random_int(100000, 999999);

        // Store in the database with a 15-minute expiration
        DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            [
                'pin' => $pin,
                'expires_at' => Carbon::now()->addMinutes(60),
                'updated_at' => now()
            ]
        );

        // Send email with the PIN
        $emailData = [
            'user' => $user,
            'pin' => $pin,
        ];

        Mail::send('emails.password-reset', $emailData, function ($message) use($user) {
            $message->to($user->email)
                ->subject('Your Password Reset PIN');
        });

        return response()->json([
            'status' => 'Success',
            'message' => 'You will receive a PIN through email shortly.'
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
            'password' => 'required|min:4|confirmed',
        ]);

        // Get PIN record from DB
        $pinRecord = DB::table('password_resets')->where('email', $request->email)->first();

        // Validate PIN
        if (!$pinRecord || $pinRecord->pin != $request->pin) {
            return response()->json(['message' => 'Invalid PIN'], 401);
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

        $user->tokens()->delete(); 
        $user->increment('login_count');

        return response()->json([
            'message' => 'Password reset successful',
            'token' => $user->createToken("API TOKEN")->plainTextToken,
            'data' =>[
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
                    'bio' => $user->bio,
                    'login_count' => $user->login_count,
                ],
            ] 
        ]);
    }
    
}

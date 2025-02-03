<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Jobs\SendCustomVerificationEmail;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('reset-password-api/{token}', function($token, Request $request){
    return Inertia::render('Auth-Api/ResetPasswordApi', [
        'token' => $token,
        'email'=>$request->email
    ]);
})
->name('password.reset.api');

Route::post('reset-password-api', function(Request $request){
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
        return Inertia::render('Verification/VerifyResetSuccess');
    }

    return response()->json([
        'message'=> __($status)
    ], 500);
})
->name('password.store.api');

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});


Route::get('verify-email-api/{id}/{hash}', function($id, $hash, Request $request){ 

    $user = User::findOrFail($id);

    if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
        return Inertia::render('Verification/VerifyEmailInvalid', [
            'id' => $user->id
        ]);
    }

    if ($user->hasVerifiedEmail()) {

        return Inertia::render('Verification/VerifyAlreadyVerified');
    }

    if ($user->markEmailAsVerified()) {
        if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail) {
            event(new Verified($user));
        }
    }

    return Inertia::render('Verification/VerifyEmail');
    })
// ->middleware(['throttle:6,1'])
->name('verification.verify.api');


Route::post('email-api/verification-notification/{id}', function(Request $request, $id){

    $user = User::findOrFail($id);

    if ($user->hasVerifiedEmail()) {
        return Inertia::render('Verification/VerifyAlreadyVerified');
    }

    // $user->sendEmailVerificationNotification();
    SendCustomVerificationEmail::dispatch($user);

    return Inertia::render('Verification/VerifyEmail');
})
        ->middleware('throttle:6,1')
        ->name('verification.send.api');


Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Inertia\Inertia;

class VerificationController extends Controller
{
    public function verify(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link'], 403);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 200);
        }

        if ($user->markEmailAsVerified()) {
            if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail) {
                event(new Verified($user));
            }
        }

        return response()->json(['message' => 'Email verified successfully'], 200);
    }

    public function api(){
        return Inertia::render('Verification/VerifyEmail');
    }
}
<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\MarkEmailAsVerified;
use App\Jobs\SendEmailVerification;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function sendVerificationEmail(Request $request)
    {
        if($request->user()->hasVerifiedEmail()){
            return response()->json([
                'status' => true,
                'message' => 'Already Verified',
            ]);
        }

        // $request->user()->sendEmailVerificationNotification();
        SendEmailVerification::dispatch($request->user());

        return response()->json([
            'status' => true,
            'message' => 'Verification Link Sent',
        ]);
    }

    public function verify(Request $request){
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ]);
        }

        if ($request->user()->markEmailAsVerified()) {

            MarkEmailAsVerified::dispatch($request->user());
            // event(new Verified($request->user()));
        }

        return response()->json([
            'message'=>'Email has been verified'
        ]);

    }
}

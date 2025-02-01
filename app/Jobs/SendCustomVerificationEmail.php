<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class SendCustomVerificationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function handle()
    {
        $webVerificationUrl = URL::temporarySignedRoute(
            'verification.verify.api',
            Carbon::now()->addMinutes(60),
            ['id' => $this->user->id, 'hash' => sha1($this->user->getEmailForVerification())]
        );

        // $apiVerificationUrl = URL::temporarySignedRoute(
        //     'api.verification.verify',
        //     Carbon::now()->addMinutes(60),
        //     ['id' => $this->user->id, 'hash' => sha1($this->user->getEmailForVerification())]
        // );

        // $mobileVerificationUrl = "yourapp://email-verify?url=" . urlencode($apiVerificationUrl);

        $emailData = [
            'user' => $this->user,
            'webVerificationUrl' => $webVerificationUrl,
            // 'mobileVerificationUrl' => $mobileVerificationUrl,
        ];

        Mail::send('emails.verify', $emailData, function ($message) {
            $message->to($this->user->email)
                ->subject('Verify Your Email Address');
        });
    }
}
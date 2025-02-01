<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\CustomResetPasswordNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

class SendCustomPasswordResetEmail implements ShouldQueue
{
    use Queueable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $token = Password::createToken($this->user);
        $resetUrl = config('app.url') . '/reset-password-api/' . $token . '?email=' . urlencode($this->user->email);

        $emailData = [
            'user' => $this->user,
            'resetUrl' => $resetUrl,
        ];

        Mail::send('emails.password-reset', $emailData, function ($message) {
            $message->to($this->user->email)
                ->subject('Reset Your Password');
        });
    }
}

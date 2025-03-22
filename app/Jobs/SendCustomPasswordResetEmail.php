<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\CustomResetPasswordNotification;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
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
    // public function handle(): void
    // {
    //     $token = Password::createToken($this->user);
        
    //     $resetUrl = config('app.url') . '/reset-password-api/' . $token . '?email=' . urlencode($this->user->email);

    //     $emailData = [
    //         'user' => $this->user,
    //         'resetUrl' => $resetUrl,
    //     ];

    //     Mail::send('emails.password-reset', $emailData, function ($message) {
    //         $message->to($this->user->email)
    //             ->subject('Reset Your Password');
    //     });
    // }


    public function handle(): void
    {
        // Generate a random 6-digit PIN
        $pin = random_int(100000, 999999);

        // Store in the database with a 15-minute expiration
        DB::table('password_resets')->updateOrInsert(
            ['email' => $this->user->email],
            [
                'pin' => $pin,
                'expires_at' => Carbon::now()->addMinutes(60),
                'updated_at' => now()
            ]
        );

        // Send email with the PIN
        $emailData = [
            'user' => $this->user,
            'pin' => $pin,
        ];

        Mail::send('emails.password-reset', $emailData, function ($message) {
            $message->to($this->user->email)
                ->subject('Your Password Reset PIN');
        });
    }
}

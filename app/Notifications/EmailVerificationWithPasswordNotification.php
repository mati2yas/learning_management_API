<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class EmailVerificationWithPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $password;

    public function __construct($password)
    {
        $this->password = $password;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verify Your Email & Set Your Password')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Welcome! Please verify your email by clicking the button below.')
            ->action('Verify Email', $verificationUrl)
            ->line('Your password is: **' . $this->password . '**')
            ->line('For security reasons, please change your password in your account settings after logging in.')
            ->line('Thank you!');
    }

    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}


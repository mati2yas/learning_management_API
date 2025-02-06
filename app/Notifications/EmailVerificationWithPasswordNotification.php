<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class EmailVerificationWithPasswordNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $password;

    /**
     * Create a new notification instance.
     */
    public function __construct($password)
    {
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        // $verificationUrl = url('/verify-email/' . $notifiable->id . '/' . sha1($notifiable->email));

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify', 
             Carbon::now()->addMinutes(60), // URL will expire in 60 minutes
            ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->email)]
        );

        return (new MailMessage)
            ->subject('Verify Your Email & Set Your Password')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Welcome! Please verify your email by clicking the button below.')
            ->action('Verify Email', $verificationUrl)
            ->line('Your password is: **' . $this->password . '**')
            ->line('For security reasons, please change your password in your account settings after logging in.')
            ->line('Thank you!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}

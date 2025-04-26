<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomUserCreationNotification extends Notification implements ShouldQueue
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
        return (new MailMessage)
            ->subject('Your Account Has Been Created')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('An account has been created for you.')
            ->line('Your email: ' . $notifiable->email)
            ->line('Your password: ' . $this->password)
            ->line('Please log in and change your password as soon as possible.')
            ->action('Log In', url('/login'))
            ->line('Thank you for using our application!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}


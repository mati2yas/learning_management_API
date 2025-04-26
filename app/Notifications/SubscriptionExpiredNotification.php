<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionExpiredNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */

    

    private $subscriptionType;
    private $forRequestedUser;
    private $userName;
    private $userEmail;
    public function __construct($message,  $userName, $userEmail, $forRequestedUser = false)
    {
        $this->subscriptionType = $message;
        $this->forRequestedUser = $forRequestedUser;
        $this->userName = $userName;
        $this->userEmail = $userEmail;
        
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable)
    {
        $mailMessage = (new MailMessage)
                    ->subject('Subscription Expired')
                    ->line('These subscriptions are expired: ' . $this->subscriptionType);
        if($this->forRequestedUser){
            $mailMessage->line('for user:')
            ->line('Email: '.$this->userEmail)
            ->line('Name:' .$this->userName);
        }

        return $mailMessage->line('Thank you for using our application!');
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

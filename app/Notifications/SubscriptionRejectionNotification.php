<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionRejectionNotification extends Notification
{
    use Queueable;
    
    private $subscriptionRequest;
    private $forRequestedUser;
    private $message;

    /**
     * Create a new notification instance.
     */
    public function __construct($message, $subscriptionRequest, $forRequestedUser = false)
    {
        $this->subscriptionRequest = $subscriptionRequest;
        $this->message=$message;
        $this->forRequestedUser = $forRequestedUser;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail','database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable)
    {
        $mailMessage = (new MailMessage)
        ->subject('Subscription Rejected')
        ->line('Sorry your subscription was rejected. ')->line('Reason: '.strval($this->message))
                    ->line('Thank you for using our application!');
                    
        if (!$this->forRequestedUser) {
            $mailMessage->action('View Request', url('/subscriptions/' . $this->subscriptionRequest->id));
        }

        return $mailMessage;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return $this->forRequestedUser
            ? ['message' => 'Sorry Your subscription was rejected. Check your payment details please.']
            : [
                'subscription_request_id' => $this->subscriptionRequest->id,
                'message' => 'New Subscription rejection received.',
            ];
    }
}

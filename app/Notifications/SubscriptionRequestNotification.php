<?php 
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $subscriptionRequest;
    private $forRequestedUser;

    public function __construct($subscriptionRequest, $forRequestedUser = false)
    {
        $this->subscriptionRequest = $subscriptionRequest;
        $this->forRequestedUser = $forRequestedUser;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $mailMessage = (new MailMessage)
            ->subject('New Subscription Request')
            ->line('A new subscription request has been submitted.')
            ->line('Total Price: Birr - ' . number_format($this->subscriptionRequest->total_price, 2));

        if (!$this->forRequestedUser) {
            $mailMessage->action('View Request', url('/subscriptions/' . $this->subscriptionRequest->id));
        }

        return $mailMessage;
    }

    public function toArray($notifiable)
    {
        return $this->forRequestedUser
            ? ['message' => 'Your subscription request was created successfully.']
            : [
                'subscription_request_id' => $this->subscriptionRequest->id,
                'message' => 'New Subscription Request received.',
            ];
    }
}

<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionApproveNotification extends Notification
{
    use Queueable;

    private $subscriptionRequest;
    private $forRequestedUser;
    private $subscription;

    public function __construct($subscriptionRequest, $subscription, $forRequestedUser = false)
    {
        $this->subscription = $subscription;
        $this->subscriptionRequest = $subscriptionRequest;
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
        // Format dates using Carbon
        $startDate = \Carbon\Carbon::parse($this->subscription->subscription_start_date)->format('d-m-Y');
        $endDate = \Carbon\Carbon::parse($this->subscription->subscription_end_date)->format('d-m-Y');

        $mailMessage = (new MailMessage)
            ->subject('Subscription Request Approved')
            ->line('A subscription request has been approved.')
            ->line('Start Date: ' .(string)$startDate.' End Date: '.(string)$endDate);
            

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
    public function toArray($notifiable)
    {
        return $this->forRequestedUser
            ? ['message' => 'Your subscription request was approved successfully.']
            : [
                'subscription_request_id' => $this->subscriptionRequest->id,
                'message' => 'New Subscription Request received.',
            ];
    }
}

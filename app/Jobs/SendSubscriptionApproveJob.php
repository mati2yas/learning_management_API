<?php

namespace App\Jobs;

use App\Notifications\SubscriptionApproveNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

class SendSubscriptionApproveJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $subscriptionRequest;
    protected $superAdmins;
    protected $workers;
    protected $user;
    protected $subscription;


    /**
     * Create a new job instance.
     */
    public function __construct($subscriptionRequest, $subscription, $superAdmins, $workers, $user)
    {
        $this->subscriptionRequest = $subscriptionRequest;
        $this->subscription = $subscription;
        $this->superAdmins = $superAdmins;
        $this->workers = $workers;
        $this->user = $user;
      
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Notification::send($this->superAdmins, new SubscriptionApproveNotification($this->subscriptionRequest, $this->subscription));
        Notification::send($this->workers, new SubscriptionApproveNotification($this->subscriptionRequest, $this->subscription));
        $this->user->notify(new SubscriptionApproveNotification($this->subscriptionRequest, $this->subscription, true));
    }
}

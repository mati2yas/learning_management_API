<?php

namespace App\Jobs;

use App\Notifications\SubscriptionRejectionNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

class SubscriptionRejectionJob implements ShouldQueue
{
    
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $subscriptionRequest;
    protected $superAdmins;
    protected $workers;
    protected $user;
   

    /**
     * Create a new job instance.
     */
    public function __construct($subscriptionRequest, $superAdmins, $workers, $user)
    {
        $this->subscriptionRequest = $subscriptionRequest;
        $this->superAdmins = $superAdmins;
        $this->workers = $workers;
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Notification::send($this->superAdmins, new SubscriptionRejectionNotification($this->subscriptionRequest));
        Notification::send($this->workers, new SubscriptionRejectionNotification($this->subscriptionRequest));
        $this->user->notify(new SubscriptionRejectionNotification($this->subscriptionRequest,  true));
    }
}

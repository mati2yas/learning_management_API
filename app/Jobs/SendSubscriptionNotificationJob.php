<?php

namespace App\Jobs;

use App\Models\APINotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

use App\Notifications\SubscriptionRequestNotification;

class SendSubscriptionNotificationJob implements ShouldQueue
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
        $permittedWorkers = $this->workers->filter(fn ($worker) => $worker->hasDirectPermission('can view subscription'));

        Notification::send($this->superAdmins, new SubscriptionRequestNotification($this->subscriptionRequest));
        
        Notification::send($permittedWorkers, new SubscriptionRequestNotification($this->subscriptionRequest));

        // Notify the requested user without a link
        APINotification::create([
            'user_id' => $this->user->id,
            'type' => 'subscription',
            'message' => "Your subscription request has been received.",
            'read' => false
        ]);

        $this->user->notify(new SubscriptionRequestNotification($this->subscriptionRequest, true));
    }
}

<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\SubscriptionExpiredNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Notification;

class SubscriptionExpiredJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    protected $subscriptionType;
    protected $userName;
    protected $userEmail;
    protected $workers;
    protected $superAdmins;
    protected $user;

    public function __construct($subscriptionType, $userName, $userEmail, $user, $workers, $superAdmins)
    {
        $this->subscriptionType = $subscriptionType;
        $this->userName = $userName;
        $this->userEmail = $userEmail;
        $this->workers = $workers;
        $this->superAdmins = $superAdmins;
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $permittedWorkers = $this->workers->filter(fn ($worker) => $worker->hasDirectPermission('can view subscription'));


        Notification::send($this->superAdmins, new SubscriptionExpiredNotification($this->subscriptionType, 
        $this->userName, $this->userEmail));

        Notification::send($permittedWorkers, new SubscriptionExpiredNotification($this->subscriptionType,
        $this->userName, 
        $this->userEmail));


        $this->user->notify(new SubscriptionExpiredNotification($this->subscriptionType, $this->userName, $this->userEmail, true));
    }
}

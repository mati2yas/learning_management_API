<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\EmailVerificationWithPasswordNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EmailVerificationSendWorkerJob implements ShouldQueue
{
    use  InteractsWithQueue, SerializesModels;

    protected $password;
    protected $user;

    /**
     * Create a new job instance.
     */
    public function __construct($user, $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Send the email notification with the provided password
        $this->user->notify(new EmailVerificationWithPasswordNotification($this->password));
        // $this->user->sendEmailVerificationNotification();
        // event(new Registered($this->user));
    }
}

<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\EmailVerificationWithPasswordNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class EmailVerificationSendWorkerJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $password;
    protected $user;

    public function __construct(User $user, $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    public function handle(): void
    {
        $this->user->notify(new EmailVerificationWithPasswordNotification($this->password));
        event(new Registered($this->user));
    }
}


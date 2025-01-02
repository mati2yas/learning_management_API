<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Bus\Queueable as BusQueueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;

class MarkEmailAsVerified implements ShouldQueue
{
    use Queueable, Dispatchable, BusQueueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public User $user)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        event(new Verified($this->user));
    }
}

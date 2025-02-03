<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionRequest extends Model
{
    /** @use HasFactory<\Database\Factories\SubscriptionRequestFactory> */
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function examCourse()
    {
        return $this->belongsTo(ExamCourse::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}

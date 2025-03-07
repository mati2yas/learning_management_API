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

    public function exams()
    {
        return $this->belongsToMany(Exam::class, 'exam_subscription_request');
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_subscription_request');
    }

    public function subscriptions(){
        return $this->hasMany(Subscription::class);
    }
}

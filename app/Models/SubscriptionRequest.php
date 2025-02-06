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

    public function examCourses()
    {
        return $this->hasMany(ExamCourse::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_subscription_request');
    }

    public function subscriptions(){
        return $this->hasMany(Subscription::class);
    }
}

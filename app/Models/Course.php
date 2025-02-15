<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    /** @use HasFactory<\Database\Factories\CourseFactory> */
    use HasFactory;
    
    protected $fillable = [
        'course_name',
        'category_id',
    ];

    public function chapters()
    {
        return $this->hasMany(Chapter::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function saves()
    {
        return $this->hasMany(Save::class);
    }

    public function paidCourses()
    {
        return $this->hasMany(PaidCourse::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function subscriptionRequests()
    {
        return $this->belongsToMany(SubscriptionRequest::class, 'course_subscription_request');
    }
}

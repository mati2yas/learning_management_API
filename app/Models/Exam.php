<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    /** @use HasFactory<\Database\Factories\ExamFactory> */
    use HasFactory;

    public function examQuestions()
    {
        return $this->hasMany(ExamQuestion::class);
    }

    public function examType()
    {
        return $this->belongsTo(ExamType::class);
    }

    public function examCourse(){
        return $this->belongsTo(ExamCourse::class);
    }

    public function examYear(){
        return $this->belongsTo(ExamYear::class);
    }

    public function subscriptionRequests()
    {
        return $this->belongsToMany(SubscriptionRequest::class, 'exam_subscription_request');
    }

    public function paidExams()
    {
        return $this->hasMany(PaidExam::class);
    }
}

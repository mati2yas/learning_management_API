<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamCourse extends Model
{
    /** @use HasFactory<\Database\Factories\ExamCourseFactory> */
    use HasFactory;

    public function examChapters(){
        return $this->hasMany(ExamChapter::class);
    }

    public function examYear()
    {
        return $this->belongsTo(ExamYear::class);
    }

    public function examGrade(){
        return $this->belongsTo(ExamGrade::class);
    }

    public function examType(){
        return $this->belongsTo(ExamType::class);
    }

    public function examQuestions()
    {
        return $this->hasMany(ExamQuestion::class);
    }

    public function examGrades()
    {
        return $this->belongsToMany(ExamGrade::class, 'exam_course_grade_map', 'exam_course_id', 'exam_grade_id');
    }
    
}







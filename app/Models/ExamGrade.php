<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamGrade extends Model
{
    /** @use HasFactory<\Database\Factories\ExamGradeFactory> */
    use HasFactory;
    public function examCourses()
    {
        return $this->hasMany(ExamCourse::class);
    }

    public function examQuestions(){
        return $this->hasMany(ExamQuestion::class);
    }


    public function examChapters()
    {
        return $this->hasMany(ExamChapter::class);
    }

}

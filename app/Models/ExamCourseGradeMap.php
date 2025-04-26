<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamCourseGradeMap extends Model
{
    protected $table = 'exam_course_grade_map';

    protected $fillable = [
        'exam_course_id',
        'exam_grade_id',
    ];

    public function course()
    {
        return $this->belongsTo(ExamCourse::class, 'exam_course_id');
    }

    public function grade()
    {
        return $this->belongsTo(ExamGrade::class, 'exam_grade_id');
    }
}

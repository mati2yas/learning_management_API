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
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamQuestion extends Model
{
    /** @use HasFactory<\Database\Factories\ExamQuestionFactory> */
    use HasFactory;

    public function examChapter(){
        return $this->belongsTo(ExamChapter::class);
    }

    public function examYear(){
        return $this->belongsTO(ExamYear::class,'exam_year_id');
    }

    public function examGrade(){
        return $this->belongsTo(ExamGrade::class);
    }

    public function examType(){
        return $this->belongsTo(ExamType::class);
    }
}

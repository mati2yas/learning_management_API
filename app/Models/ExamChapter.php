<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamChapter extends Model
{
    /** @use HasFactory<\Database\Factories\ExamChapterFactory> */
    use HasFactory;

    public function examCourse(){
        return $this->belongsTo(ExamCourse::class);
    }
}

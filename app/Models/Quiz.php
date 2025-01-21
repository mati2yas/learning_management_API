<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    /** @use HasFactory<\Database\Factories\QuizFactory> */
    use HasFactory;

    public function quizQuestions(){
        return $this->hasMany(QuizQuestion::class);
    }

    public function chapter(){
        return $this->belongsTo(Chapter::class);
    }
}

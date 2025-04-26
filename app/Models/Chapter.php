<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    /** @use HasFactory<\Database\Factories\ChaptersFactory> */
    use HasFactory;

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function contents(){
        return $this->hasMany(Content::class);
    }

    public function quizzes(){
        return $this->hasMany(Quiz::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamYear extends Model
{
    /** @use HasFactory<\Database\Factories\ExamYearFactory> */
    use HasFactory;

    public function examQuestions(){
        return $this->hasMany(ExamQuestion::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    /** @use HasFactory<\Database\Factories\CourseFactory> */
    use HasFactory;
    
    protected $fillable = [
        'course_name',
        'category_id',
        'number_of_chapters',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    /** @use HasFactory<\Database\Factories\DepartmentFactory> */
    use HasFactory;

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function batches(){
        return $this->hasMany(Batch::class);
    }
}

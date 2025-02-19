<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FileContent extends Model
{
    /** @use HasFactory<\Database\Factories\FileContentFactory> */
    use HasFactory;

    public function content(){
        return $this->belongsTo(Content::class);
    }
}

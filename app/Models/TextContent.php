<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TextContent extends Model
{
    /** @use HasFactory<\Database\Factories\TextContentFactory> */
    use HasFactory;

    public function content(){
        return $this->belongsTo(Content::class);
    }
    
}

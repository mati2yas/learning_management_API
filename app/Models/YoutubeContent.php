<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YoutubeContent extends Model
{
    /** @use HasFactory<\Database\Factories\YoutubeContentFactory> */
    use HasFactory;

    public function content(){
        return $this->belongsTo(Content::class);
    }
}

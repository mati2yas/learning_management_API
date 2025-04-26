<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    /** @use HasFactory<\Database\Factories\ContentFactory> */
    use HasFactory;

    public function chapter()
    {
        return $this->belongsTo(Chapter::class);
    }

    public function youtubeContents(){
        return $this->hasMany(YoutubeContent::class);
    }

    public function textContents(){
        return $this->hasMany(
            TextContent::class
        );
    }

    public function fileContents(){
        return $this->hasMany(
            FileContent::class
        );
    }
}

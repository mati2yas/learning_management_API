<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChapterResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'course_id' => $this->course_id,
            'contents' =>  $this->whenLoaded('contents', function(){
                return $this->contents->map(function($content){
                    return[
                        'id' => $content->id,
                        'name' => $content->name,
                        'order' => $content->order,
                    ];
                });
            }),
        ];
    }
}

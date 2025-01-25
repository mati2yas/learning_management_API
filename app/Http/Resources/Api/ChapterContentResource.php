<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChapterContentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'videos' => $this->flatMap(function ($content) {
                return $content->youtubeContents->map(function ($youtubeContent) {
                    return [
                        'id' => $youtubeContent->id,
                        'title' => $youtubeContent->title, // Include other video properties
                        'url' => $youtubeContent->url,
                    ];
                });
            })->unique('id')->values(), // Avoid duplicate video entries based on `id`
    
            'documents' => $this->flatMap(function ($content) {
                return $content->fileContents->map(function ($fileContent) {
                    return [
                        'id' => $fileContent->id,
                        'title' => $fileContent->title, // Include other file properties
                        'file_url' => $fileContent->file_url,
                    ];
                });
            })->unique('id')->values(), // Avoid duplicate document entries based on `id`
        ];
    }
    
}

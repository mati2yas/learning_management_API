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
            'videos' => $this->youtubeContents->map(function ($youtubeContent) {
                return [
                    'Url' => $youtubeContent->url,
                ];
            }),
            'documents' => $this->fileContents->map(function ($fileContent) {
                return [
                    'file' => $fileContent->file_url,
                ];
            }),
        ];
    }
}

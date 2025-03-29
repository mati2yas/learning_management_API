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
        $videos = [];
        $documents = [];

        // Iterate once over contents and extract related videos & documents
        foreach ($this->contents as $content) {
            foreach ($content->youtubeContents as $youtubeContent) {
                $videos[$youtubeContent->id] = [
                    'id' => $youtubeContent->id,
                    'title' => $youtubeContent->title,
                    'url' => $youtubeContent->url,
                ];
            }

            foreach ($content->fileContents as $fileContent) {
                $documents[$fileContent->id] = [
                    'id' => $fileContent->id,
                    'title' => $fileContent->title,
                    'file_url' => url($fileContent->file_url),
                ];
            }
        }

        return [
            'videos' => array_values($videos),  // Remove duplicate video entries
            'documents' => array_values($documents),  // Remove duplicate document entries
            'quizzes' => $this->quizzes->map(fn($quiz) => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'number_of_questions' => $quiz->quizQuestions->count()
            ])->toArray(),
        ];
    }
}

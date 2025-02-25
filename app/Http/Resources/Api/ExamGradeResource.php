<?php
namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamGradeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'grade' => $this->grade,  // 
            'chapters' => $this->getChapters(),
        ];
    }

    private function getChapters()
    {
        return $this->examCourses->flatMap(function ($course) {
            return $course->examChapters->map(function ($chapter) {
                return [
                    'id' => $chapter->id,
                    'title' => $chapter->title,
                    'questions_count' => $chapter->examQuestions->count()? $chapter->examQuestions->count() : 0,
                ];
            });
        })->unique('id')->values()->toArray();  // Ensure unique chapters
    }
}

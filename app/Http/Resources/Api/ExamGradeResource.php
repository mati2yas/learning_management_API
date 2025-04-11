<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamGradeResource extends JsonResource
{
    protected $courseId;

    public function __construct($resource, $courseId = null)
    {
        parent::__construct($resource);
        $this->courseId = $courseId;
    }

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'grade' => $this->grade,
            'chapters' => $this->getChapters(),
        ];
    }

    private function getChapters()
    {
        $courseId = request()->route('exam_course_id'); // get from route if passed
    
        return $this->examQuestions
            ->where('exam_course_id', $courseId)
            ->map(function ($question) {
                $chapter = $question->examChapter;
                return $chapter ? [
                    'id' => $chapter->id,
                    'title' => $chapter->title,
                    'questions_count' => $chapter->examQuestions->count() ?: 0,
                ] : null;
            })
            ->filter() // remove nulls
            ->unique('id')
            ->values()
            ->toArray();
    }
    
}

<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamCourseTypeResource extends JsonResource
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
            'course_name' => $this->course_name,
            'exam_years' => $this->getUniqueExamYears(),
        ];
    }

    /**
     * Extract unique exam years with their respective exam question count.
     */
    private function getUniqueExamYears(): array
    {
        return $this->examQuestions
            ->groupBy('exam_year_id') // Group questions by exam_year_id
            ->map(function ($questions, $yearId) {
                $examYear = $questions->first()->examYear; // Get the first examYear instance

                return [
                    'id' => $yearId,
                    'year_name' => optional($examYear)->year, // Handle possible null examYear
                    'exam_questions_count' => $questions->count(), // Count questions in this year
                ];
            })
            ->values()
            ->all();
    }
}

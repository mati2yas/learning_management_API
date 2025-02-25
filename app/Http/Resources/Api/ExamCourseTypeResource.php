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
            'questions_count' => $this->examQuestions->count(),
            'course_name' => $this->course_name,
            'exam_years' => $this->getUniqueExamYears(),
        ];
    }

    /**
     * Extract unique exam years from the related exam questions.
     */
    private function getUniqueExamYears(): array
    {
        return $this->examQuestions
            ->pluck('examYear.year', 'examYear.id') // Assuming 'year_name' in the ExamYear model
            ->unique()
            ->map(function ($year, $id) {
                return [
                    'id' => $id,
                    'year_name' => $year,
                ];
            })
            ->values()
            ->all();
    }
}

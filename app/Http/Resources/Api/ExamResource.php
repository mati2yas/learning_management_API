<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $user = $request->user();
        
        return [
            'id' => $this->exam->examCourse->id,
            'course_name' => $this->exam->examCourse->course_name,
            'exam_years' => $this->getUniqueExamYears($user),
        ];
    }

}
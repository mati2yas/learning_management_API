<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamYearResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->examYear->id ?? null,
            'exam_year' => $this->examYear->year ?? 'N/A',
            'questions_count' => $this->question_count,
        ];
    }
}

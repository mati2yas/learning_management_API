<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class ExamQuestionChapterResource extends JsonResource
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
            'exam_course_id' => $this->exam_course_id,
            "exam_grade_id" => $this->exam_grade_id,
            "exam_type_id" => $this->exam_type_id,
            "exam_chapter_id" => $this->exam_chapter_id,
            "question_text"=> $this->question_text,
            "options" => $this->options,
            "answer" => $this->answer ,
            "question_image_url" => $this->question_image_url ? url($this->question_image_url) : null,
            'image_explanation_url' => $this->image_explanation_url ? url($this->image_explanation_url) : null,
            "text_explanation" => $this->text_explanation,
            "video_explanation_url" => $this->video_explanation_url,
        ];
    }
}

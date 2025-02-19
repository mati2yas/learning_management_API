<?php

namespace App\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionRequestResource extends JsonResource
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
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'exam_course' => $this->whenLoaded('exam_course', function () {
                return [
                    'id' => $this->exam_course->id,
                    'name' => $this->exam_course->course_name,
                ];
            }),
            'courses' => $this->whenLoaded('courses', function () {
                return $this->courses->map(fn($course) => [
                    'id' => $course->id,
                    'name' => $course->course_name,
                ]);
            }),
            'transaction_id' => $this->transaction_id,
            'proof_of_payment' => $this->proof_of_payment,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

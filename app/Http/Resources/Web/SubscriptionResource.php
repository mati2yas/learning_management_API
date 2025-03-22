<?php 

namespace App\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
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
            'subscription_request' => $this->whenLoaded('subscriptionRequest', function () {
                return [
                    'id' => $this->subscriptionRequest->id,
                    'user' => $this->subscriptionRequest->user ? [
                        'id' => $this->subscriptionRequest->user->id,
                        'name' => $this->subscriptionRequest->user->name,
                        'email' => $this->subscriptionRequest->user->email,
                    ] : null,
                    'courses' => $this->subscriptionRequest->relationLoaded('courses')
                        ? $this->subscriptionRequest->courses->map(fn($course) => [
                            'id' => $course->id,
                            'name' => $course->course_name,
                        ])
                        : null,
                    'exams' => $this->subscriptionRequest->relationLoaded('exams')
                        ? $this->subscriptionRequest->exams->map(fn($exam) => [
                            'id' => $exam->id,
                            'name' => $exam->examCourse->course_name ?? 'Unknown Exam',
                        ])
                        : null,

                    'proof_of_payment' => $this->subscriptionRequest->proof_of_payment,
                    'total_price' => $this->subscriptionRequest->total_price,
                    'status' => $this->subscriptionRequest->status,
                    'subscription_type' => $this->subscriptionRequest->subscription_type,
                    'created_at' => $this->subscriptionRequest->created_at,
                    'updated_at' => $this->subscriptionRequest->updated_at,
                ];
            }),
            'subscription_start_date' => $this->subscription_start_date,
            'subscription_end_date' => $this->subscription_end_date,
            'status' => $this->status,
        ];
    }
}

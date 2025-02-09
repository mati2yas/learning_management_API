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
                    'course' => $this->subscriptionRequest->course ? [
                        'id' => $this->subscriptionRequest->course->id,
                        'name' => $this->subscriptionRequest->course->course_name,
                    ] : null,
                    'exam_course' => $this->subscriptionRequest->examCourse ? [
                        'id' => $this->subscriptionRequest->examCourse->id,
                        'name' => $this->subscriptionRequest->examCourse->course_name,
                    ] : null,
                    'proof_of_payment' => 
                    $this->subscriptionRequest->proof_of_payment,
                    'total_price' => $this->subscriptionRequest->total_price,
                    'status' => $this->subscriptionRequest->status,
                    'created_at' => $this->subscriptionRequest->created_at,
                    'updated_at' => $this->subscriptionRequest->updated_at,
                ];
            }),
            'subscription_start_date' => $this->subscription_start_date,
            'subscription_end_date' => $this->subscription_end_date,
        ];
    }
}

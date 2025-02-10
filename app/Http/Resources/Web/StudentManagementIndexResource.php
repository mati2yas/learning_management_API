<?php

namespace App\Http\Resources\Web;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentManagementIndexResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'gender' => $this->gender,
            'subscriptionRequests' => $this->subscriptionRequests->map(function ($request) {
                return [
                    'id' => $request->id,
                    'exam_courses' => $request->courses->map(fn($course) => ['id' => $course->id, 'name' => $course->name]),
                    'exam_course' => $request->exam_course ? $request->exam_course->map(fn($course) => ['id' => $course->id, 'name' => $course->name]) : null,
                    'total_price' => $request->total_price,
                    'proof_of_payment' => $request->proof_of_payment,
                    'transaction_id' => $request->transaction_id,
                    'status' => $request->status,
                    'created_at' => $request->created_at,
                    'updated_at' => $request->updated_at,
                    'subscription' => $request->subscription ? [
                        'id' => $request->subscription->id,
                        'subscription_start_date' => $request->subscription->subscription_start_date,
                        'subscription_end_date' => $request->subscription->subscription_end_date,
                        'created_at' => $request->subscription->created_at,
                        'updated_at' => $request->subscription->updated_at,
                    ] : null,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
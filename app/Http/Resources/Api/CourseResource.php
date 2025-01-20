<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
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
            'id' => $this->id,
            'course_name' => $this->course_name,
            'thumbnail' => $this->thumbnail,
            'department_id' => $this->department_id,
            'grade_id' => $this->grade_id,
            'batch_id' => $this->batch_id,
            'price_one_month' => $this->price_one_month,
            'price_three_month' => $this->price_three_month,
            'price_six_month' => $this->price_six_month,
            'price_one_year' => $this->price_one_year,
            'paid' => $user ? $this->isPaidByUser($user->id) : false,
            'saved' => $user ? $this->isSavedByUser($user->id) : false,
            'liked' => $user ? $this->isLikedByUser($user->id) : false,
        ];
    }

    /**
     * Check if the course is paid by a specific user.
     *
     * @param int $userId
     * @return bool
     */

    protected function isPaidByUser(int $userId): bool
    {
        return $this->paidCourses()->where('user_id', $userId)->exists();
    }

    /**
     * Check if the course is saved by a specific user.
     *
     * @param int $userId
     * @return bool
     */
    protected function isSavedByUser(int $userId): bool
    {
        return $this->saves()->where('user_id', $userId)->exists();
    }

        /**
     * Check if the course is saved by a specific user.
     *
     * @param int $userId
     * @return bool
     */
    protected function isLikedByUser(int $userId): bool
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }
    
}

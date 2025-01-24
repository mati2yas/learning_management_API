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
            'thumbnail' => 'https://picsum.photos/'.$this->thumbnail,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                ];
            }),
            'department' => $this->whenLoaded('department', function () {
                return [
                    'id' => $this->department->id,
                    'department_name' => $this->department->departement_name,
                ];
            }),
            'grade' => $this->whenLoaded('grade', function () {
                return [
                    'id' => $this->grade->id,
                    'grade_name' => $this->grade->grade_name,
                    'stream'=> $this->grade->stream,
                ];
            }),
            'chapters' => $this->whenLoaded('chapters', function () {
                return $this->chapters->map(function ($chapter) {
                    return [
                        'id' => $chapter->id,
                        'title' => $chapter->title,
                    ];
                });
            }),
            'batch' => $this->whenLoaded('batch', function () {
                return [
                    'id' => $this->batch->id,
                    'batch_name' => $this->batch->batch_name,
                ];
            }),
            'price_one_month' => $this->price_one_month,
            'on_sale_month' => $this->on_sale_month,
            'price_three_month' => $this->price_three_month,
            'on_sale_three_month' => $this->on_sale_three_month,
            'price_six_month' => $this->price_six_month,
            'on_sale_six_month' => $this->on_sale_six_month,
            'price_one_year' => $this->price_one_year,
            'on_sale_one_year' => $this->on_sale_one_year,
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
     * Check if the course is liked by a specific user.
     *
     * @param int $userId
     * @return bool
     */
    protected function isLikedByUser(int $userId): bool
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }
}

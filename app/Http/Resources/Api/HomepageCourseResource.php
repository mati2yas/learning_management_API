<?php 
namespace App\Http\Resources\Api;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomepageCourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user(); // Get the current user

        return [
            'id' => $this->id,
            'course_name' => $this->course_name,
            'thumbnail' => $this->getThumbnailUrl(),
            'price_one_month' => $this->price_one_month,
            'on_sale_one_month' => $this->on_sale_one_month,
            'price_three_month' => $this->price_three_month,
            'on_sale_three_month' => $this->on_sale_three_month,
            'price_six_month' => $this->price_six_month,
            'on_sale_six_month' => $this->on_sale_six_month,
            'price_one_year' => $this->price_one_year,
            'on_sale_one_year' => $this->on_sale_one_year,
            'likes_count' => $this->likes_count,
            'saves_count' => $this->saves_count,
            'chapter_count' => $this->chapters->count(),
            'stream' => $this->stream ? $this->stream : null,
            'batch' => $this->batch ? [
                'id' => $this->batch->id,
                'batch_name' => $this->batch->batch_name,
            ] : null,
            'grade' => $this->grade ? [
                'id' => $this->grade->id,
                'grade_name' => $this->grade->grade_name,
            ] : null,
            'department' => $this->department ? [
                'id' => $this->department->id,
                'name' => $this->department->name,
            ] : null,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ] : null,
            'is_liked' => $user ? $this->isLikedByUser($user->id) : false,
            'is_saved' => $user ? $this->isSavedByUser($user->id) : false,
        ];
    }

    /**
     * Get the complete thumbnail URL.
     *
     * @return string
     */
    protected function getThumbnailUrl(): string
    {
        // Check if the thumbnail starts with "/id", append the base URL if true
        return $this->thumbnail && strpos($this->thumbnail, '/id') === 0
            ? 'https://picsum.photos' . $this->thumbnail
            : $this->thumbnail;
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
}

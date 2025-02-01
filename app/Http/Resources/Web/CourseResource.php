<?php 

namespace App\Http\Resources\Web;

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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'thumbnail' => $this->thumbnail, // Ensure this is the correct attribute name
            'category_id' => $this->category_id,
            'category' => $this->category->name ?? null, // Access the related category's name
            'grade_id' => $this->grade_id,
            'grade' => $this->grade->grade_name ?? null, // Access the related grade's name
            'department_id' => $this->department_id,
            'department' => $this->department->department_name ?? null, // Access the related department's name
            'batch_id' => $this->batch_id,
            'batch' => $this->batch->batch_name ?? null, // Access the related batch's name
            'topicsCount' => $this->chapters()->count(), // Count the related topics
            'saves' => $this->saves()->count(), // Count the saves
            'likes' => $this->likes()->count(), // Count the likes
            'price_one_month' => $this->price_one_month,
            'price_three_month' => $this->price_three_month,
            'price_six_month' => $this->price_six_month,
            'price_one_year' => $this->price_one_year,
        ];
    }
}

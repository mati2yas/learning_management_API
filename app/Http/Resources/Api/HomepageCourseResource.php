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
        return [
            'id' => $this->id,
            'course_name' => $this->course_name,
            'thumbnail' => $this->thumbnail,
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
        ];
    }
}

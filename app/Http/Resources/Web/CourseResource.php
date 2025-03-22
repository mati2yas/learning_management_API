<?php

namespace App\Http\Resources\Web;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'course_name' => $this->course_name,
            'thumbnail' => $this->thumbnail,
            'category_id' => optional($this->category)->id,
            'stream' => $this->stream ? $this->stream : null,
            'category' => optional($this->category)->name,
            'grade_id' => optional($this->grade)->id,
            'grade' => optional($this->grade)->grade_name,
            'department_id' => optional($this->department)->id,
            'department' => optional($this->department)->department_name,
            'batch_id' => optional($this->batch)->id,
            'batch' => optional($this->batch)->batch_name,
            'topicsCount' => $this->chapters->count(),
            'saves' => $this->saves->count(),
            'likes' => $this->likes->count(),
            'paidCourses' => $this->paidCourses->count(),
            'price_one_month' => $this->price_one_month,
            'on_sale_one_month' => $this->on_sale_one_month,
            'price_three_month' => $this->price_three_month,
            'on_sale_three_month' => $this->on_sale_three_month,
            'price_six_month' => $this->price_six_month,
            'on_sale_six_month' => $this->on_sale_six_month,
            'price_one_year' => $this->price_one_year,
            'on_sale_one_year' => $this->on_sale_one_year,
            'created_by' => ['name' => optional($this->createdBy)->name],
            'updated_by' => ['name' => optional($this->updatedBy)->name],
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}


//https://cdn.courses.apisystem.tech/memberships/YDmVucZsFEQkzq8Q6j7V/post-materials/2b1e109c-534b-4020-ad96-13a4b2144994/Account-Detail-no-Background.json
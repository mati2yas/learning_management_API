<?php

namespace Database\Factories;

use App\Models\Batch;
use App\Models\Category;
use App\Models\Grade;
use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = Category::pluck('name')->toArray();
        $category = $this->faker->randomElement($categories);

        $grade_id = null;
        $department_id = null;
        $batch_id = null;
        $stream = null;

        if ($category === 'lower_grades') {
            $grade_name = $this->faker->randomElement([
                'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'
            ]);
        } elseif ($category === 'higher_grades') {
            $grade_name = $this->faker->randomElement([
                'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
            ]);
            if (in_array($grade_name, ['Grade 11', 'Grade 12'])) {
                $stream = $this->faker->randomElement(['Natural', 'Social', null]);
            }
        } elseif ($category === 'university') {
            $department = Department::inRandomOrder()->first();
            $department_id = $department ? $department->id : null;
            
            $batch = Batch::where('department_id', $department_id)->inRandomOrder()->first();
            $batch_id = $batch ? $batch->id : null;
            $grade_name = null;
        } else {
            $grade_name = null;
        }

        if ($grade_name) {
            $grade = Grade::where('grade_name', $grade_name)->first();
            $grade_id = $grade ? $grade->id : null;
        }

        $base_price = $this->faker->numberBetween(500, 1000);

        return [
            'course_name' => $this->faker->randomElement([
                'Chemistry', 'Physics', 'Biology', 'Mathematics', 'History', 'Geography', 'English', 'Amharic'
            ]),
            'thumbnail' => fake()->randomElement(['/id/' . rand(1, 200) . '/200/300']),
            'category_id' => Category::where('name', $category)->value('id'),
            'grade_id' => $grade_id,
            'department_id' => $department_id,
            'batch_id' => $batch_id,
            'stream' => $grade_name && in_array($grade_name, ['Grade 11', 'Grade 12']) ? $stream : null,
            'price_one_month' => $base_price,
            'on_sale_one_month' => round($base_price * $this->faker->randomFloat(2, 1.1, 1.5)),
            'price_three_month' => $base_price * 2.8,
            'on_sale_three_month' => round(($base_price * 2.8) * $this->faker->randomFloat(2, 1.1, 1.5)),
            'price_six_month' => $base_price * 5.5,
            'on_sale_six_month' => round(($base_price * 5.5) * $this->faker->randomFloat(2, 1.1, 1.5)),
            'price_one_year' => $base_price * 10,
            'on_sale_one_year' => round(($base_price * 10) * $this->faker->randomFloat(2, 1.1, 1.5)),
        ];
    }
}

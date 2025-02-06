<?php

namespace Database\Factories;

use App\Models\Batch;
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
        $category_id = fake()->randomElement([1, 2, 3, 4]);
        $grade_id = null;
        $department_id = null;
        $batch_id = null;

        // Handle grade_id and department_id based on category_id
        if ($category_id === 1) {
            $grade_id = fake()->numberBetween(1, 8);
        } elseif ($category_id === 2) {
            $grade_id = fake()->numberBetween(9, 14);
        } elseif ($category_id === 3) {
            $department_id = fake()->numberBetween(1, 32);
            $batch = Batch::where('department_id', $department_id)->inRandomOrder()->first();
            $batch_id = $batch ? $batch->id : null;
        }

        // Generate prices and on_sale values
        $price_one_month = fake()->numberBetween(500, 1000);
        $price_three_month = fake()->numberBetween(1400, 2800);
        $price_six_month = fake()->numberBetween(3000, 5500);
        $price_one_year = fake()->numberBetween(6000, 10000);

        return [
            'course_name' => fake()->randomElement([
                'chemistry', 'physics', 'biology', 'mathematics', 'history', 'geography', 'english', 'amharic'
            ]),
            'thumbnail' => fake()->randomElement(['/id/' . rand(1, 200) . '/200/300']),
            'category_id' => $category_id,
            'grade_id' => $grade_id,
            'department_id' => $department_id,
            'batch_id' => $batch_id,
            'price_one_month' => $price_one_month,
            'on_sale_one_month' => $price_one_month * 1.3,
            'price_three_month' => $price_three_month,
            'on_sale_three_month' => $price_three_month * 1.3,
            'price_six_month' => $price_six_month,
            'on_sale_six_month' => $price_six_month * 1.3,
            'price_one_year' => $price_one_year,
            'on_sale_one_year' => $price_one_year * 1.3,
        ];
    }
}

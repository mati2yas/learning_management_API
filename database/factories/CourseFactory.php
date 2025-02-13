<?php

namespace Database\Factories;

use App\Models\Batch;
use App\Models\Category;
use App\Models\Grade;
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
        // Define possible categories dynamically based on existing Category records
        $categories = Category::pluck('name')->toArray();
        $category = $this->faker->randomElement($categories);

        $grade_id = null;
        $stream = null;
        $department_id = null;
        $batch_id = null;

        // Handle grade and stream based on category
        if ($category === 'lower_grades') {
            $grade_name = $this->faker->randomElement([
                'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'
            ]);
        } elseif ($category === 'higher_grades') {
            $grade_name = $this->faker->randomElement([
                'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
            ]);
            if (in_array($grade_name, ['Grade 11', 'Grade 12'])) {
                $stream = $this->faker->randomElement(['Natural', 'Social']);
            }
        } elseif ($category === 'university') {
            $department_id = $this->faker->numberBetween(1, 32);
            $batch = Batch::where('department_id', $department_id)->inRandomOrder()->first();
            $batch_id = $batch ? $batch->id : null;
            $grade_name = null;
        } else {
            $grade_name = null;
        }

        // Map grade_name and stream to grade_id dynamically from the Grade model
        if ($grade_name) {
            $query = Grade::where('grade_name', $grade_name);
            if ($stream) {
                $query->where('stream', $stream);
            }
            $grade_id = $query->value('id');
        }

        // Generate prices and on_sale values with dynamic factors
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
            // 'stream' => $stream,
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


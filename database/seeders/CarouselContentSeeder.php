<?php

namespace Database\Seeders;

use App\Models\CarouselContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CarouselContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CarouselContent::factory(5)->create([
            'tag' => fake()->randomElement(['You can find all courses here','The best app to do exam','you can buy exam-courses ']),
            'image_url' => fake()->randomElement(['/id/' . rand(1, 200) . '/200/300']),
            'status' => fake()->randomElement([true, false])
        ]);
    }
}

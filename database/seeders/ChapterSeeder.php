<?php
namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Course;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChapterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Chapter::query()->delete();
        
        if (DB::table('chapters')->count() === 0) {
            $courses = Course::all();
            $courses->each(function ($course) {
                // Create 10 chapters with sequential order for each course
                foreach (range(1, 10) as $order) {
                    Chapter::factory()->create([
                        'course_id' => $course->id,  // Set the course ID for the chapter
                        'order' => $order,            // Set the sequential order value
                        'description' => fake()->paragraph(3),
                    ]);
                }
            });
        }
    }
}

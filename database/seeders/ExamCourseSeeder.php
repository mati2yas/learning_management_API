<?php

namespace Database\Seeders;

use App\Models\ExamCourse;
use App\Models\ExamYear;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamCourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $faker = app(\Faker\Generator::class);

        if(DB::table('exam_courses')->count() === 0){
            $exam_years = ExamYear::all();

            $exam_years->each(
                function($exam_type) {
                    ExamCourse::factory()->create([
                        'exam_year_id' => $exam_type->id,
                        'course_name' => fake()->promptAI('Ethiopian National Examination Courses Name', fake()->name)
                    ]);
                }
            );
        }
    }
}

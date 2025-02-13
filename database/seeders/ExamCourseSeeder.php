<?php

namespace Database\Seeders;

use App\Models\ExamCourse;
use App\Models\ExamGrade;
use App\Models\ExamType;
use App\Models\ExamYear;
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

        
        ExamCourse::query()->delete();
        if(DB::table('exam_courses')->count() === 0) {
            // Get all exam types and exam grades
            $exam_types = ExamType::all();
            $exam_grades = ExamGrade::all();

            // Loop through each combination of exam types and exam grades
            $exam_types->each(function($exam_type) use ($exam_grades) {
                $exam_grades->each(function($exam_grade) use ($exam_type) {
                    ExamCourse::factory()->create([
                        'exam_type_id' => $exam_type->id,
                        'exam_grade_id' => $exam_grade->id,
                        'course_name' => fake()->unique()->promptAI('Ethiopian National Examination Courses Name', fake()->name)
                    ]);
                });
            });
        }
    }
}

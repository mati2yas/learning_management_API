<?php

namespace Database\Seeders;

use App\Models\ExamCourse;
use App\Models\ExamGrade;
use App\Models\ExamYear;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamGradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if(DB::table('exam_grades')->count() === 0){
            $exam_courses = ExamCourse::all();

            $exam_courses->each(
                function($exam_course){
                    foreach(range(9, 12) as $grade){
                        ExamGrade::factory()->create([
                            'exam_course_id' => $exam_course->id,
                            'grade' => $grade,
                        ]);
                    }
                }
            );
        }
    }
}

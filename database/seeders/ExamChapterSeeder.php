<?php

namespace Database\Seeders;

use App\Models\ExamChapter;
use App\Models\ExamCourse;
use App\Models\ExamGrade;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamChapterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ExamChapter::query()->delete();

        if(DB::table('exam_chapters')->count() === 0){
            $exam_courses = ExamCourse::all();
          
            $exam_courses->each(
                function($exam_course, $index) {
                    ExamChapter::factory()->create([
                        'exam_course_id' => $exam_course,
                        'title'=> fake()->name,
                        'sequence_order' => $index + 1,
                    ]);
                    
                }
            );
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\ExamChapter;
use App\Models\ExamGrade;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamChapterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if(DB::table('exam_chapters')->count() === 0){
            $exam_grades = ExamGrade::all();
          
            $exam_grades->each(
                function($exam_grade, $index) {
                    ExamChapter::factory()->create([
                        'exam_grade_id' => $exam_grade->id,
                        'title'=> fake()->name,
                        'sequence_order' => $index + 1,
                    ]);
                    
                }
            );
        }
    }
}

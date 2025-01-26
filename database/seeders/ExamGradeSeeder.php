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
            $exam_years = ExamYear::all();

            $exam_years->each(
                function($exam_year){
                    foreach(range(9, 12) as $grade){
                        ExamGrade::factory()->create([
                            'exam_year_id' => $exam_year->id,
                            'grade' => $grade,
                        ]);
                    }
                }
            );
        }
    }
}

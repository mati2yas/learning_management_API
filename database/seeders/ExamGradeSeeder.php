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
    /**d
     * Run the database seeds.
     */
    public function run(): void
    {
        ExamGrade::query()->delete();

        if(DB::table('exam_grades')->count() === 0){
            
            for ($grade = 5; $grade <= 8; $grade++) {
                ExamGrade::firstOrCreate([
                    'grade' => $grade,
                ]);
            }


            for ($grade = 9; $grade <= 12; $grade++) {
        
                ExamGrade::firstOrCreate([
                    'grade' => $grade,
                ]);
                   
            }
        }
    }
}

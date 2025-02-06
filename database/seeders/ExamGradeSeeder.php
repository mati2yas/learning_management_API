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
            

            for ($grade = 1; $grade <= 8; $grade++) {
                ExamGrade::firstOrCreate([
                    'grade' => $grade,
                ]);
            }


            for ($grade = 9; $grade <= 12; $grade++) {

                    if($grade == 11 || $grade == 12){
                        foreach (['natural', 'social'] as $stream) {
                            ExamGrade::firstOrCreate([
                                'grade' => $grade,
                                'stream' => $stream, // Assuming there's a 'stream' column in your Grade model
                            ]);

                        }
                    } else {
                        ExamGrade::firstOrCreate([
                            'grade' => $grade,
                        ]);
                    }
            
            }
        }
    }
}

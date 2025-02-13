<?php

namespace Database\Seeders;

use App\Models\ExamCourse;
use App\Models\ExamGrade;
use App\Models\ExamType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamCourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ExamCourse::query()->delete();
        
        if(DB::table('exam_courses')->count() === 0) {
            $exam_types = ExamType::all();
            $exam_grades = ExamGrade::all();

            foreach ($exam_types as $exam_type) {
                switch ($exam_type->name) {
                    case '6th Grade Ministry':
                        $this->createCoursesForGrades($exam_type, $exam_grades->whereIn('grade', [5, 6]));
                        break;
                    case '8th Grade Ministry':
                        $this->createCoursesForGrades($exam_type, $exam_grades->whereIn('grade', [7, 8]));
                        break;
                    case 'ESSLCE':
                        $this->createCoursesForGrades($exam_type, $exam_grades->whereIn('grade', [10, 11, 12]));
                        break;
                    default:
                        $this->createCoursesWithoutGrade($exam_type);
                        break;
                }
            }
        }
    }

    private function createCoursesForGrades($exam_type, $grades)
    {
        foreach ($grades as $grade) {
            ExamCourse::factory()->create([
                'exam_type_id' => $exam_type->id,
                'exam_grade_id' => $grade->id,
                'course_name' => fake()->unique()->promptAI('Ethiopian National Examination Courses Name', fake()->name)
            ]);
        }
    }

    private function createCoursesWithoutGrade($exam_type)
    {
        ExamCourse::factory()->create([
            'exam_type_id' => $exam_type->id,
            'exam_grade_id' => null,
            'course_name' => fake()->unique()->promptAI('Ethiopian National Examination Courses Name', fake()->name)
        ]);
    }
}


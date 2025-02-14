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
        // Delete existing courses
        ExamCourse::query()->delete();
        
        // Only seed if there are no existing courses
        if(DB::table('exam_courses')->count() === 0) {
            // Fetch all exam types and exam grades
            $exam_types = ExamType::all();
            $exam_grades = ExamGrade::all();

            // Loop through each exam type
            foreach ($exam_types as $exam_type) {
                switch ($exam_type->name) {
                    case '6th Grade Ministry':
                        // For 6th Grade Ministry, create courses for grades 5 and 6
                        $this->createCoursesForGrades($exam_type, $exam_grades->whereIn('grade', [5, 6]));
                        break;
                    case '8th Grade Ministry':
                        // For 8th Grade Ministry, create courses for grades 7 and 8
                        $this->createCoursesForGrades($exam_type, $exam_grades->whereIn('grade', [7, 8]));
                        break;
                    case 'ESSLCE':
                        // For ESSLCE, create courses for grades 10, 11, and 12
                        $this->createCoursesForGrades($exam_type, $exam_grades->whereIn('grade', [10, 11, 12]));
                        break;
                    default:
                        // For other exam types, create courses without grade
                        $this->createCoursesWithoutGrade($exam_type);
                        break;
                }
            }
        }
    }

    // Create courses for specific exam types and grades
    private function createCoursesForGrades($exam_type, $grades)
    {
        foreach ($grades as $grade) {
            // Determine the stream for Grade 11 and Grade 12
            $stream = null;
            if (in_array($grade->grade, [11, 12])) {
                // Randomly assign 'social', 'natural', or null to the stream
                $stream = collect([null, 'social', 'natural'])->random();
            }

            // Create a course for each grade and exam type
            ExamCourse::factory()->create([
                'exam_type_id' => $exam_type->id,
                'exam_grade_id' => $grade->id,
                'course_name' => fake()->unique()->promptAI('Ethiopian National Examination Courses Name', fake()->name),
                'stream' => $stream,  // Assign stream for Grade 11 and 12, or leave null for others
            ]);
        }
    }

    // Create courses without specific grade
    private function createCoursesWithoutGrade($exam_type)
    {
        // Create a course for exam type without grade
        ExamCourse::factory()->create([
            'exam_type_id' => $exam_type->id,
            'exam_grade_id' => null,  // No grade associated
            'course_name' => fake()->unique()->promptAI('Ethiopian National Examination Courses Name', fake()->name),
            'stream' => null,  // Stream is null for these cases
        ]);
    }
}

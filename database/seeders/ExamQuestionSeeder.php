<?php

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\ExamGrade;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class ExamQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a Faker instance for generating random data
        $faker = Faker::create();

        // Clear the exam questions table
        ExamQuestion::query()->delete();

        // Fetch all available exams with their related courses and chapters
        $exams = Exam::with(['examCourse.examChapters', 'examType'])->get();

        // Predefined video URLs
        $videoUrls = [
            'https://youtu.be/bhMjn3coMcE?si=RKFJ7aENSAK0uttx',
            'https://youtu.be/SAb4zRyxrD4?si=3QqxDrMvlwvhix7D',
            'https://youtu.be/ShJw2I8cgBE?si=ntcUMuT5vT0nMtax',
            'https://youtu.be/thAIw6vhchw?si=BQr6DXk6Tb2oQ2Nk',
            'https://youtu.be/H58vbez_m4E?si=R8oLjzyKnvWpX1ye',
            'https://youtu.be/dQw4w9WgXcQ?si=1ZrkLC5dp6LMiymt'
        ];

        // List of exam types that don't require an exam grade
        $noExamGradeTypes = ['NGAT', 'SAT', 'UAT', 'EXIT', 'EXAM'];

        foreach ($exams as $exam) {
            // Get chapters for the course (if available)
            $chapters = $exam->examCourse->examChapters;

            for ($i = 0; $i < 60; $i++) {
                // Generate random options as an array of strings
                $options = [
                    $faker->country(),
                    $faker->country(),
                    $faker->country(),
                    $faker->country(),
                ];

                // Randomly pick one option as the correct answer
                $answer = [$options[array_rand($options)]];
                $videoExplanation = $videoUrls[array_rand($videoUrls)];

                // Pick a random chapter for the current course, but only if chapters are available
                $randomChapter = $chapters->isNotEmpty() ? $chapters->random()->id : null;

                // Check if the exam type name requires an exam grade
                $examGradeId = null;
                if (!in_array($exam->examType->name, $noExamGradeTypes)) {
                    // Attempt to fetch an exam grade, but only if available
                    $examGrade = ExamGrade::inRandomOrder()->first();
                    $examGradeId = $examGrade ? $examGrade->id : null;
                }

                ExamQuestion::create([
                    'exam_id' => $exam->id,
                    'exam_type_id' => $exam->exam_type_id,
                    'exam_grade_id' => $examGradeId, // May be null if no grade is required or available
                    'exam_year_id' => $exam->exam_year_id, // Use the real exam_year_id
                    'exam_course_id' => $exam->exam_course_id,
                    'exam_chapter_id' => $randomChapter, // Ensure the chapter is from the current course, may be null
                    'question_text' => $faker->sentence(),
                    'text_explanation' => $faker->paragraph(),
                    'video_explanation_url' => $videoExplanation,
                    'question_image_url' => fake()->randomElement(['/id/' . rand(1, 200) . '/200/300']),
                    'image_explanation_url' => fake()->randomElement(['/id/' . rand(1, 200) . '/200/300']),
                    'options' => json_encode($options), // Store options as a JSON array
                    'answer' => json_encode($answer), // Store answer as a JSON array
                ]);
            }
        }
    }
}

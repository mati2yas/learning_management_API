<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExamCourse;
use App\Models\ExamChapter;
use App\Models\ExamQuestion;
use App\Models\ExamYear;  // Import ExamYear model
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
        // ExamQuestion::query()->delete(); // Ensure the table is cleared

        // ExamQuestion::query()->delete();
        // Fetch all available exam years (real IDs)
        $examYears = ExamYear::all();

        // Check if there are any exam years in the database
        if ($examYears->isEmpty()) {
            throw new \Exception("No exam years available in the database.");
        }

        $videoUrls = [
            'https://youtu.be/bhMjn3coMcE?si=RKFJ7aENSAK0uttx',
            'https://youtu.be/SAb4zRyxrD4?si=3QqxDrMvlwvhix7D',
            'https://youtu.be/ShJw2I8cgBE?si=ntcUMuT5vT0nMtax',
            'https://youtu.be/thAIw6vhchw?si=BQr6DXk6Tb2oQ2Nk',
            'https://youtu.be/H58vbez_m4E?si=R8oLjzyKnvWpX1ye',
            'https://youtu.be/dQw4w9WgXcQ?si=1ZrkLC5dp6LMiymt'
        ];

        // Get all exam courses
        $courses = ExamCourse::with('examChapters')->get();

        foreach ($courses as $course) {
            // Get chapters for the course
            $chapters = $course->examChapters;

            // Loop through each exam year and seed 60 questions for each course
            foreach ($examYears as $examYear) {
                // Seed 60 questions for this exam_year and course
                for ($i = 0; $i < 1; $i++) {
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

                    // Pick a random chapter for the current course
                    $randomChapter = $chapters->random();

                    ExamQuestion::create([
                        'exam_type_id' => $course->exam_type_id,
                        'exam_grade_id' => $course->exam_grade_id,
                        'exam_year_id' => $examYear->id, // Use the real exam_year_id
                        'exam_course_id' => $course->id,
                        'exam_chapter_id' => $randomChapter->id, // Ensure the chapter is from the current course
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
}

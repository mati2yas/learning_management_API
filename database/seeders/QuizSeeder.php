<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Quiz;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if(DB::table('quizzes')->count() === 0){

            $chapters = Chapter::all();
            $chapters->each(function($chapter){
                // Create 5 quizzes for each chapter
                foreach(range(1, 5) as $order){
                    Quiz::factory()->create([
                        'chapter_id' => $chapter->id,
                        'title' => fake()->sentence(3),
                    ]);
                }
            });
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\ExamType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $faker = app(\Faker\Generator::class);

        // ExamType::query()->delete();

        if(DB::table('exam_types')->count() === 0){
            $exam_types = ['ministry', 'matric', 'ngat','exit'];
            foreach($exam_types as $exam_type){
                ExamType::factory()->create([
                    'name'=> $exam_type
                ]);
            }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\ExamYear;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExamYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete existing records to avoid duplication
        ExamYear::query()->delete();

        if (DB::table('exam_years')->count() === 0) {
            $years = range(2001, 2050); // Generate years from 2001 to 2050

            foreach ($years as $year) {
                ExamYear::factory()->create([
                    'year' => $year,
                ]);
            }
        }
    }
}

<?php

namespace Database\Seeders;


use App\Models\ExamYear;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ExamYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ExamYear::query()->delete();

        if (DB::table('exam_years')->count() === 0) {
            // Calculate current Ethiopian year
            $gregorianYear = Carbon::now()->year;
            $ethiopianYear = $gregorianYear - 8; // Ethiopian year is 8 years behind Gregorian
            
            $maxYear = min($ethiopianYear - 1, 2016); // Either Ethiopian year - 1 or 2016
            $years = range(2001, $maxYear); // Generate years from 2001 to maxYear

            // Use the $years variable properly in the callback
        
            foreach ($years as $year) {
                ExamYear::factory()->create([
                    // 'exam_type_id' => 1,
                    'year' => $year,
                ]);
            }
           
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Grade;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB as FacadesDB;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Grade::query()->delete();

        if(FacadesDB::table('grades')->count() == 0){

            $lowerGradesCategory = Category::where('name', 'lower_grades')->first();
            $higherGradesCategory = Category::where('name', 'higher_grades')->first();

            if (!$lowerGradesCategory || !$higherGradesCategory) {
                $this->command->error('Please seed the categories table first.');
                return;
            }

            // Create grades 1-8 for 'lower_grades'
            for ($grade = 1; $grade <= 8; $grade++) {
                Grade::firstOrCreate([
                    'grade_name' => "Grade $grade",
                    'category_id' => $lowerGradesCategory->id,
                ]);
            }

            for ($grade = 9; $grade <= 12; $grade++) {
                Grade::firstOrCreate([
                    'grade_name' => "Grade $grade",
                    'category_id' => $higherGradesCategory->id,
                ]);
            }

            // Create grades 9-12 for 'higher_grades'
        }
    }
}

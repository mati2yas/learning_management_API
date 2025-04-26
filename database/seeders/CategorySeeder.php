<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB as FacadesDB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::query()->delete();
        if(FacadesDB::table('categories')->count() == 0){
            $categories = [
                'lower_grades',
                'higher_grades',
                'university',
                'random_courses',
            ];
    
            // Insert each category if it doesn't already exist
            foreach ($categories as $category) {
                Category::firstOrCreate(['name' => $category]);
            }
    
        }
    }
}

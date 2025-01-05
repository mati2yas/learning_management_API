<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (DB::table('departments')->count() == 0) {
            $names = [
                'Computer Science', 
                'Engineering', 
                'Accounting and Finance', 
                'Marketing', 
                'Medicine', 
                'Law', 
                'Agriculture', 
                'Nursing', 
                'Education', 
                'Public Health', 
                'Economics', 
                'Sociology', 
                'Psychology', 
                'Journalism and Communications', 
                'Pharmacy', 
                'Architecture', 
                'Mathematics', 
                'Physics', 
                'Biology', 
                'Chemistry', 
                'Environmental Science', 
                'Business Administration', 
                'Information Technology', 
                'Statistics', 
                'Geology', 
                'Political Science and International Relations',
                'Veterinary Medicine', 
                'History and Heritage Studies', 
                'Foreign Languages and Literature', 
                'Theology and Religious Studies', 
                'Tourism and Hospitality Management',
                'Fine Arts and Design'
            ];

            foreach ($names as $name) {
                Department::factory()->create([
                    'category_id' => 3, // Assuming '3' corresponds to University in your categories
                    'department_name' => $name,
                ]);
            }
        }
    }
}

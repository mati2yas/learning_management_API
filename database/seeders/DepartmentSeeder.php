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
        Department::query()->delete();
        if (DB::table('departments')->count() == 0) {
            // $names = [
            //     'Computer Science', 
            //     'Engineering', 
            //     'Accounting and Finance', 
            //     'Marketing', 
            //     'Medicine', 
            //     'Law', 
            //     'Agriculture', 
            //     'Nursing', 
            //     'Education', 
            //     'Public Health', 
            //     'Economics', 
            //     'Sociology', 
            //     'Psychology', 
            //     'Journalism and Communications', 
            //     'Pharmacy', 
            //     'Architecture', 
            //     'Mathematics', 
            //     'Physics', 
            //     'Biology', 
            //     'Chemistry', 
            //     'Environmental Science', 
            //     'Business Administration', 
            //     'Information Technology', 
            //     'Statistics', 
            //     'Geology', 
            //     'Political Science and International Relations',
            //     'Veterinary Medicine', 
            //     'History and Heritage Studies', 
            //     'Foreign Languages and Literature', 
            //     'Theology and Religious Studies', 
            //     'Tourism and Hospitality Management',
            //     'Fine Arts and Design'
            // ];


            $names = [
                'Accounting and Finance', 
                'Applied Chemistry', 
                'Applied Mathematics', 
                'Applied Physics', 
                'Architecture', 
                'Biology', 
                'Biomedical Engineering', 
                'Business Administration', 
                'Chemical Engineering', 
                'Chemistry', 
                'Civil Engineering', 
                'Computer Science', 
                'Data Science', 
                'Dentistry', 
                'Economics', 
                'Electrical Engineering', 
                'Geography and Environmental Studies', 
                'Geology', 
                'History and Heritage Management', 
                'Industrial Engineering', 
                'Information System', 
                'Information Technology', 
                'International Relations', 
                'Journalism and Communication', 
                'Law', 
                'Management Information Systems (MIS)', 
                'Marketing Management', 
                'Mathematics', 
                'Mechanical Engineering', 
                'Medical Laboratory Science', 
                'Medicine (MD)', 
                'Nursing', 
                'Pharmacy', 
                'Physics', 
                'Political Science', 
                'Pre-Engineering', 
                'Psychology', 
                'Public Health', 
                'Public Relations', 
                'Sociology', 
                'Software Engineering', 
                'Statistics', 
                'Urban Planning and Development'
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

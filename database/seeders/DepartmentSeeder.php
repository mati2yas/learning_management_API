<?php

namespace Database\Seeders;

use App\Models\Category;
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
                'Afan Oromo, Litrature and Communication',
                'Anesthesia',
                'Applied Chemistry', 
                'Applied Mathematics', 
                'Applied Physics', 
                'Architecture', 
                'Biology', 
                'Biomedical Engineering', 
                'Business Administration and Information Systems', 
                'Chemical Engineering', 
                'Chemistry', 
                'Civil Engineering', 
                'Computer Science', 
                'Common Courses',
                'Data Science', 
                'Dentistry', 
                'Doctor of Veterinary Medicine',
                'Economics', 
                'English Language and Litrature',
                'Electrical Engineering', 
                'Environmental Engineering',
                'Freshman',
                'Food Science and Nutrition',
                'Geography and Environmental Studies', 
                'Geology', 
                'History and Heritage Management', 
                'Industrial Engineering', 
                'Information System', 
                'Information Technology', 
                'International Relations', 
                'Journalism and Communication', 
                'Law', 
                'Logistics and Supply Chain Mangement',
                'Management',
                'Management Information Systems (MIS)', 
                'Marketing Management', 
                'Mathematics', 
                'Mechanical Engineering', 
                'Medical Laboratory Science', 
                'Medicine (MD)', 
                'Midwifery',
                'Minig Engineering',
                'Nursing', 
                'Pharmacy', 
                'Physics', 
                'Political Science and International Relations', 
                'Pre-Engineering', 
                'Psychology', 
                'Public Health', 
                'Public Relations', 
                'Medical Radiologic Technology',
                'Sociology', 
                'Social Work',
                'Software Engineering', 
                'Exercise and Sport',
                'Statistics', 
                'Urban Planning and Development',
                'Veterinary Science'
            ];

            $department = Category::where('name', 'university')->first();
            
            foreach ($names as $name) {
                Department::factory()->create([
                    'category_id' => $department->id, // Assuming '3' corresponds to University in your categories
                    'department_name' => $name,
                ]);
            }
        }
    }
}

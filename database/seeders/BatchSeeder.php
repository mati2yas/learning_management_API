<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\Department;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Batch::query()->delete();

        if (DB::table('batches')->count() == 0) {
            // Retrieve all departments
            $departments = Department::all();

            foreach ($departments as $department) {
                $years = [];
                if (str_ends_with($department->department_name, 'Engineering')) {
                    if ($department->department_name === 'Pre-Engineering') {
                        $years = ['1st Year', '2nd Year'];
                    } else {
                        $years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
                    }
                } elseif (str_starts_with($department->department_name, 'Medicine')) {
                    $years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', '6th Year', '7th Year'];
                } elseif ($department->department_name === 'Pharmacy') {
                    $years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];
                } elseif($department->department_name === 'Freshman'){
                    $years = ['1st Year'];
                } elseif($department->department_name === "Common Courses" ){
                    $years =['1st Year'];

                }else {
                    $years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
                }

                // Create batches for the department
                foreach ($years as $year) {
                    Batch::factory()->create([
                        'department_id' => $department->id,
                        'batch_name' => $year,
                    ]);
                }
            }
        }
    }
}

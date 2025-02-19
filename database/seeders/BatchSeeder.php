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

                // Determine the years based on the department name
                if (str_ends_with($department->department_name, 'Engineering')) {
                    if ($department->department_name === 'Pre-Engineering') {
                        $years = ['Freshman', '2nd Year'];
                    } else {
                        $years = ['Freshman', '2nd Year', '3rd Year', '4th Year', '5th Year'];
                    }
                } elseif (str_starts_with($department->department_name, 'Medicine')) {
                    $years = ['Freshman', '2nd Year', '3rd Year', '4th Year', '5th Year', '6th Year', '7th Year'];
                } elseif ($department->department_name === 'Pharmacy') {
                    $years = ['Freshman', '2nd Year', '3rd Year', '4th Year', '5th Year'];
                } elseif($department->department_name === 'Freshman'){
                    $years = ['Freshman'];
                }else {
                    $years = ['Freshman', '2nd Year', '3rd Year', '4th Year'];
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

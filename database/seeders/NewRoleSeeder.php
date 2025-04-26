<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class NewRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'admin', 'guard_name' => 'api'],
            ['name' => 'admin', 'guard_name' => 'web'],
            ['name' => 'student', 'guard_name' => 'api'],
            ['name' => 'student', 'guard_name' => 'web'],
            ['name' => 'worker', 'guard_name' => 'api'], // New worker role
            ['name' => 'worker', 'guard_name' => 'web'], // New worker role
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate($roleData);
        }
    }
}

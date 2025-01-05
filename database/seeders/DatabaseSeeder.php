<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->callOnce(RoleSeeder::class);
        $this->callOnce(CategorySeeder::class);
        $this->callOnce(GradeSeeder::class);
        $this->callOnce(DepartmentSeeder::class);
        $this->callOnce(BatchSeeder::class);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::query()->delete();

        if(Permission::count() == 0){
            $permissions = [
                ['name'=> 'add courses'],
                ['name'=> 'update courses'],
                ['name'=> 'delete courses'],
                
                ['name'=> 'add chapters'],
                ['name'=> 'update chapters'],
                ['name'=> 'delete chapters'],
    
                ['name'=> 'add content'],
                ['name'=> 'update content'],
                ['name'=> 'delete content'],

                ['name'=> 'approve subscription'],
                ['name'=> 'update subscription'],
                ['name'=> 'delete subscription'],

                ['name' => 'add quizzes'],
                ['name'=> 'update quizzes'],
                ['name' => 'delete quizzes'],

                ['name' => 'add quiz questions'],
                ['name' => 'update quiz questions'],
                ['name' => 'delete quiz questions'],

                ['name' => 'add exam questions'],
                ['name' => 'update exam questions'],
                ['name' => 'delete exam questions'],

                ['name' => 'can view contents'],

                ['name' => 'add exam courses'],
                ['name' => 'update exam courses'],
                ['name' => 'delete exam courses'],

                ['name' => 'can ban'],
                ['name' => 'can unban'],

                ['name' => 'add worker'],
                ['name' => 'update worker'],
                ['name' => 'delete worker'],

                ['name' => 'add exams'],
                ['name' => 'update exams'],
                ['name' => 'delete exams'],

                ['name' => 'can view subscription']
            ];
        

            foreach ($permissions as $permission) {
                Permission::firstOrCreate([
                    'name'=> $permission['name'],
                    'guard_name' => 'api'
                ]);
                
                Permission::create([
                    'name'=> $permission['name'],
                    'guard_name' => 'web'
                ]);
            }

        }
    }
}

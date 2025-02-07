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
            ];
        

            foreach ($permissions as $permission) {
                Permission::create([
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

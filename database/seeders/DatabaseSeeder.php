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
        //     'name' => 'Admin Admin',
        //     'email' => 'admin@admin.com',
        // ]);

        // $this->callOnce(RoleSeeder::class);
        // $this->callOnce(CategorySeeder::class);
        // $this->callOnce(GradeSeeder::class);
        // $this->callOnce(DepartmentSeeder::class);
        // $this->callOnce(BatchSeeder::class);
        // $this->callOnce(CourseSeeder::class);
        // $this->callOnce(ChapterSeeder::class);
        // $this->callOnce(ContentSeeder::class);
        // $this->callOnce(YoutubeContentSeeder::class);
        // $this->callOnce(FileContentSeeder::class);
        // $this->callOnce(QuizSeeder::class);

        // $this->callOnce( PermissionSeeder::class);
        // $this->callOnce( NewRoleSeeder::class);



        $this->callOnce(ExamTypeSeeder::class);//right
        $this->callOnce(ExamYearSeeder::class); //right
        $this->callOnce(ExamGradeSeeder::class); // right
        $this->callOnce(ExamCourseSeeder::class);// right
        $this->callOnce(ExamChapterSeeder::class); // right
        $this->callOnce(ExamQuestionSeeder::class);
        
    }
}

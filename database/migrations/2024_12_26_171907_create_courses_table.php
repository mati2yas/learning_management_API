<?php

use App\Models\Batch;
use App\Models\Category;
use App\Models\Department;
use App\Models\Grade;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('course_name');
            $table->foreignIdFor(Department::class);
            $table->foreignIdFor(Grade::class);
            $table->foreignIdFor(Batch::class);
            $table->foreignIdFor(Category::class)->cascadeOnDelete();
            $table->timestamps();
            $table->unsignedInteger('number_of_chapters');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};

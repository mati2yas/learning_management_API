<?php

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
        Schema::create('exam_course_grade_map', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('exam_course_id');
            $table->unsignedBigInteger('exam_grade_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_course_grade_map');
    }
};

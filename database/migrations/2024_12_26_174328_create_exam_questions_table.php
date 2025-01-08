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
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_course_id')->nullable()->constrained('exam_courses')->nullOnDelete();
            $table->foreignId('exam_chapter_id')->nullable()->constrained('exam_chapters')->nullOnDelete();
            $table->foreignId('exam_year_id')->nullable()->constrained('exam_years')->nullOnDelete();
            $table->text('question_text');
            $table->string('exam_type')->nullable(); // Optional field
            $table->json('options');
            $table->json('answer');
            $table->string('question_image_url')->nullable();
            $table->text('text_explanation');
            $table->string('video_explanation_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_questions');
    }
};

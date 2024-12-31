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
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('question_number');
            $table->foreignId('quizz_id')->constrained('quizzes')->cascadeOnDelete();
            $table->text('text');
            $table->string('question_image_url')->nullable();
            $table->text('text_explanation');
            $table->string('video_explanation_url')->nullable();
            $table->json('options');
            $table->json('answer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};

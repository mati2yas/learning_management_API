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
        Schema::table('exam_questions', function (Blueprint $table) {
            if (!Schema::hasColumn('exam_questions', 'exam_grade_id')) {
                $table->foreignId('exam_grade_id')->nullable()->constrained('exam_grades')->nullOnDelete();
            }
            
            // Make sure other required columns exist as well
            if (!Schema::hasColumn('exam_questions', 'exam_chapter_id')) {
                $table->foreignId('exam_chapter_id')->nullable()->constrained('exam_chapters')->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_questions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('exam_grade_id');
            $table->dropConstrainedForeignId('exam_chapter_id');
        });
    }
};

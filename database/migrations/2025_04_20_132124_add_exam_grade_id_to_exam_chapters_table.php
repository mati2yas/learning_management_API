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
        Schema::table('exam_chapters', function (Blueprint $table) {
            $table->unsignedBigInteger('exam_grade_id')->nullable()->after('id');

            // Add foreign key constraint (optional if you're okay with loose relation)
            $table->foreign('exam_grade_id')
                  ->references('id')
                  ->on('exam_grades')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_chapters', function (Blueprint $table) {
            $table->dropForeign(['exam_grade_id']);
            $table->dropColumn('exam_grade_id');
        });
    }
};

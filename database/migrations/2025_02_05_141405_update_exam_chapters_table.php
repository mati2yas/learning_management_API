<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('exam_chapters', function (Blueprint $table) {
            // Drop foreign key constraint and remove exam_grade_id column
            $table->dropForeign(['exam_grade_id']);
            $table->dropColumn('exam_grade_id');
            
            // Add exam_course_id column with foreign key
            $table->unsignedBigInteger('exam_course_id')->nullable();
            $table->foreign('exam_course_id')->references('id')->on('exam_courses')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('exam_chapters', function (Blueprint $table) {
            // Remove exam_course_id column and foreign key
            $table->dropForeign(['exam_course_id']);
            $table->dropColumn('exam_course_id');
            
            // Add back exam_grade_id column with foreign key
            $table->unsignedBigInteger('exam_grade_id')->nullable();
            $table->foreign('exam_grade_id')->references('id')->on('exam_grades')->onDelete('set null');
        });
    }
};

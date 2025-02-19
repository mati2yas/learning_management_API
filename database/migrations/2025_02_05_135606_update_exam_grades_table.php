<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('exam_grades', function (Blueprint $table) {
            // Drop foreign key constraint (if it exists)
            $table->dropForeign(['exam_course_id']);
            
            // Remove the exam_course_id column
            $table->dropColumn('exam_course_id');
            
            // Add the new nullable stream column
            $table->string('stream')->nullable();
        });
    }

    public function down()
    {
        Schema::table('exam_grades', function (Blueprint $table) {
            // Add back the exam_course_id column
            $table->unsignedBigInteger('exam_course_id')->nullable();
            
            // Restore foreign key constraint
            $table->foreign('exam_course_id')->references('course_id')->on('exam_course')->onDelete('cascade');
            
            // Remove the stream column
            $table->dropColumn('stream');
        });
    }
};

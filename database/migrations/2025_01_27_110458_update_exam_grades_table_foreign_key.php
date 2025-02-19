<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateExamGradesTableForeignKey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exam_grades', function (Blueprint $table) {
            // Drop the old foreign key constraint
            $table->dropForeign(['exam_year_id']);
            $table->dropColumn('exam_year_id');

            // Add the new foreign key column
            $table->unsignedBigInteger('exam_course_id')->nullable();

            // Add the new foreign key constraint
            $table->foreign('exam_course_id')
                ->references('id')
                ->on('exam_courses')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exam_grades', function (Blueprint $table) {
            // Drop the new foreign key constraint
            $table->dropForeign(['exam_course_id']);
            $table->dropColumn('exam_course_id');

            // Add the old foreign key column back
            $table->unsignedBigInteger('exam_year_id')->nullable();

            // Restore the old foreign key constraint
            $table->foreign('exam_year_id')
                ->references('id')
                ->on('exam_years')
                ->onDelete('cascade');
        });
    }
}

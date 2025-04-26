<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('exam_courses', function (Blueprint $table) {
            // Add exam_type_id column with foreign key
            $table->unsignedBigInteger('exam_type_id')->nullable();
            $table->foreign('exam_type_id')->references('id')->on('exam_types')->onDelete('set null');

            // Add exam_grade_id column with foreign key
            $table->unsignedBigInteger('exam_grade_id')->nullable();
            $table->foreign('exam_grade_id')->references('id')->on('exam_grades')->onDelete('set null');

            // Drop foreign key constraint and make exam_year_id nullable
            $table->dropForeign(['exam_year_id']);
            $table->unsignedBigInteger('exam_year_id')->nullable()->change();
            $table->foreign('exam_year_id')->references('id')->on('exam_years')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('exam_courses', function (Blueprint $table) {
            // Drop foreign keys and columns
            $table->dropForeign(['exam_type_id']);
            $table->dropColumn('exam_type_id');
            $table->dropForeign(['exam_grade_id']);
            $table->dropColumn('exam_grade_id');

            $table->dropForeign(['exam_year_id']);
            $table->unsignedBigInteger('exam_year_id')->nullable(false)->change();
            $table->foreign('exam_year_id')->references('id')->on('exam_years')->onDelete('cascade');
        });
    }
};

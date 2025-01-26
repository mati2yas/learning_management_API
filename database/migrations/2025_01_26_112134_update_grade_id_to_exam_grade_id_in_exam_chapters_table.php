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
            // Drop the existing foreign key and column
            $table->dropForeign(['grade_id']);
            $table->dropColumn('grade_id');

            // Add the new foreign key column
            $table->foreignId('exam_grade_id')
                ->after('id') // Place the column after 'id'
                ->constrained('exam_grades') // Reference 'exam_grades' table
                ->cascadeOnDelete(); // Enable cascading delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_chapters', function (Blueprint $table) {
            // Drop the new foreign key and column
            $table->dropForeign(['exam_grade_id']);
            $table->dropColumn('exam_grade_id');

            // Re-add the old foreign key and column
            $table->foreignId('grade_id')
                ->after('id') // Place the column after 'id'
                ->constrained('grades') // Reference 'grades' table
                ->cascadeOnDelete(); // Enable cascading delete
        });
    }
};

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
        Schema::table('exam_grades', function (Blueprint $table) {
            $table->foreignId('exam_year_id')
                ->after('grade') // Add the column after the 'grade' column
                ->constrained('exam_years') // Add foreign key constraint to 'exam_years' table
                ->cascadeOnDelete(); // Enable cascading delete
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_grades', function (Blueprint $table) {
            $table->dropForeign(['exam_year_id']); // Remove the foreign key constraint
            $table->dropColumn('exam_year_id'); // Drop the column
        });
    }
};

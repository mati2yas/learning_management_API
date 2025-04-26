<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('exam_years', function (Blueprint $table) {
            // Drop the foreign key if it exists
            $table->dropForeign(['exam_type_id']);

            // Modify the exam_type_id column to be nullable
            $table->unsignedBigInteger('exam_type_id')->nullable()->change();

            // Add foreign key constraint referencing exam_types table
            $table->foreign('exam_type_id')
                  ->references('id')->on('exam_types')
                  ->onDelete('set null');  // Optional: if you want to set null when the exam type is deleted
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('exam_years', function (Blueprint $table) {
            // Drop the foreign key
            $table->dropForeign(['exam_type_id']);

            // Change the exam_type_id back to non-nullable
            $table->unsignedBigInteger('exam_type_id')->nullable(false)->change();
        });
    }
};

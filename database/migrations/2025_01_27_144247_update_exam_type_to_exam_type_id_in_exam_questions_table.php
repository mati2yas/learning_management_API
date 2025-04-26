<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('exam_questions', function (Blueprint $table) {
            // Rename the column
            $table->renameColumn('exam_type', 'exam_type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('exam_questions', function (Blueprint $table) {
            // Rename the column back to the original name
            $table->renameColumn('exam_type_id', 'exam_type');
        });
    }
};

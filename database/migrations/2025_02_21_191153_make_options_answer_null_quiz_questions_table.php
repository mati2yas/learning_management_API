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
        Schema::table('quiz_questions', function (Blueprint $table) {
      
            $table->json('options')->nullable()->change();
            $table->json('answer')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quiz_questions', function (Blueprint $table) {

            $table->json('options')->nullable(false)->change();
            // Revert 'answer' column only if it was changed previously
            $table->json('answer')->nullable(false)->change();
        });
    }
};

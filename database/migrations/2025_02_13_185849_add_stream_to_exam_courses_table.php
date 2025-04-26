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
        Schema::table('exam_courses', function (Blueprint $table) {
            $table->enum('stream', [null, 'social', 'natural'])->after('exam_type_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_courses', function (Blueprint $table) {
            $table->dropColumn('stream');
        });
    }
};

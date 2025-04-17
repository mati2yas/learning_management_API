<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('paid_courses', function (Blueprint $table) {
            $table->boolean('expired')->default(false)->after('course_id');
        });

        Schema::table('paid_exams', function (Blueprint $table) {
            $table->boolean('expired')->default(false)->after('exam_id');
        });
    }

    public function down(): void
    {
        Schema::table('paid_courses', function (Blueprint $table) {
            $table->dropColumn('expired');
        });

        Schema::table('paid_exams', function (Blueprint $table) {
            $table->dropColumn('expired');
        });
    }
};

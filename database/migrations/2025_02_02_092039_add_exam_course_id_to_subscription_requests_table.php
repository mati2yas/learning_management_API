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
        Schema::table('subscription_requests', function (Blueprint $table) {
            $table->foreignId('exam_course_id')->nullable()->after('user_id')->constrained('exam_courses')->cascadeOnDelete();
            $table->foreignId('course_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscription_requests', function (Blueprint $table) {
            
            $table->foreignId('course_id')->nullable(false)->change();
            $table->dropForeign(['exam_course_id']);
            $table->dropColumn('exam_course_id');
        });
    }
};

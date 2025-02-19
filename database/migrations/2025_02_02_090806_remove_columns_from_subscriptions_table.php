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
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->date('subscription_start_date')->after('id');
            $table->date('subscription_end_date')->after('subscription_start_date');
            // Drop foreign key constraints
            $table->dropForeign(['course_id']);
            $table->dropForeign(['exam_course_id']);
            $table->dropForeign(['user_id']);

            // Drop the columns
            $table->dropColumn(['course_id', 'exam_course_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {

            $table->dropColumn(['subscription_start_date', 'subscription_end_date']);
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('exam_course_id')->constrained('exam_courses')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
        });
    }
};

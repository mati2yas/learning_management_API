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
        Schema::create('exams', function (Blueprint $table) {

            $table->id();
            $table->foreignId('exam_type_id')->constrained('exam_types')->cascadeOnDelete();

            $table->foreignId('exam_year_id')->constrained('exam_years')
            ->cascadeOnDelete();

            $table->foreignId('exam_course_id')->nullable()->constrained('exam_courses')->cascadeOnDelete();

            $table->decimal('price_one_month', 8, 2)->nullable();
            $table->decimal('price_three_month', 8, 2)->nullable();
            $table->decimal('price_six_month', 8, 2)->nullable();
            $table->decimal('price_one_year', 8, 2)->nullable();  
            $table->decimal('on_sale_one_month', 8, 2)->nullable();
            $table->decimal('on_sale_three_month', 8, 2)->nullable();
            $table->decimal('on_sale_six_month', 8, 2)->nullable();
            $table->decimal('on_sale_one_year', 8, 2)->nullable();
            $table->string('stream')->nullable();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};

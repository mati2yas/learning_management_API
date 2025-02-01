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
        Schema::table('courses', function (Blueprint $table) {
            $table->decimal('price_one_month', 8, 2)->after('category_id')->nullable();
            $table->decimal('price_three_month', 8, 2)->after('price_one_month')->nullable();
            $table->decimal('price_six_month', 8, 2)->after('price_three_month')->nullable();
            $table->decimal('price_one_year', 8, 2)->after('price_six_month')->nullable();  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
           
            $table->dropColumn('price_one_month');
            $table->dropColumn('price_three_month');
            $table->dropColumn('price_six_month');
            $table->dropColumn('price_one_year');
        });
    }
};

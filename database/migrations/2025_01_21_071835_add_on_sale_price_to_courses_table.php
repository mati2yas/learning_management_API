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
            $table->decimal('on_sale_month', 8, 2)->after('price_one_month')->nullable();
            $table->decimal('on_sale_three_month', 8, 2)->after('price_three_month')->nullable();
            $table->decimal('on_sale_six_month', 8, 2)->after('price_six_month')->nullable();
            $table->decimal('on_sale_one_year', 8, 2)->after('price_one_year')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            //
        });
    }
};

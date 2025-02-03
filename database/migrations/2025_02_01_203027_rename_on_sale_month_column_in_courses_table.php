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
            Schema::table('courses', function (Blueprint $table) {
                $table->renameColumn('on_sale_month', 'on_sale_one_month');
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            Schema::table('courses', function (Blueprint $table) {
                $table->renameColumn('on_sale_one_month', 'on_sale_month');
            });
        });
    }
};

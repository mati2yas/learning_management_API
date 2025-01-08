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
            $table->foreignIdFor(\App\Models\Batch::class)->nullable()->change();
            $table->foreignIdFor(\App\Models\Grade::class)->nullable()->change();
            $table->foreignIdFor(\App\Models\Department::class)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->foreignIdFor(\App\Models\Batch::class)->nullable(false)->change();
            $table->foreignIdFor(\App\Models\Grade::class)->nullable(false)->change();
            $table->foreignIdFor(\App\Models\Department::class)->nullable(false)->change();
        });
    }
};

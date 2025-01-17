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
        Schema::table('contents', function (Blueprint $table) {
            $table->text('text_content')->nullable()->after('order'); // For text-based content
            $table->string('youtube_url')->nullable()->after('text_content'); // For YouTube URLs
            $table->string('file_path')->nullable()->after('youtube_url'); // For file uploads
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contents', function (Blueprint $table) {
            // $table->string('url')->change();
            $table->dropColumn('text_content');
            $table->dropColumn('youtube_url');
            $table->dropColumn('file_path');
           
        });
    }
};

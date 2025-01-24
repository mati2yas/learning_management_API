<?php

namespace Database\Seeders;

use App\Models\Content;
use App\Models\FileContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FileContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (DB::table('file_contents')->count() === 0) {
            $contents = Content::all();

            $contents->each(function ($content) {
                foreach ([
                    'https://example.com/files/sample1.pdf',
                    'https://example.com/files/sample2.docx',
                    'https://example.com/files/sample3.pptx',
                ] as $fileUrl) {
                    FileContent::factory()->create([
                        'content_id' => $content->id,
                        'title' => fake()->name,
                        'file_url' => $fileUrl,
                    ]);
                }
            });
        }
    }
}

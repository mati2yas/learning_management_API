<?php

namespace Database\Seeders;

use App\Models\Content;
use App\Models\YoutubeContent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class YoutubeContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if(DB::table('youtube_contents')->count() === 0){
            $contents = Content::all();

            $contents->each(function($content){
                foreach([
                    'https://youtu.be/bhMjn3coMcE?si=RKFJ7aENSAK0uttx',
                    'https://youtu.be/SAb4zRyxrD4?si=3QqxDrMvlwvhix7D',
                    'https://youtu.be/ShJw2I8cgBE?si=ntcUMuT5vT0nMtax',
                ] as $url){
                    YoutubeContent::factory()->create(
                        [
                            'content_id' => $content->id,
                            'title' => fake()->name,
                            'url' => $url
                        ]
                    );
                }
            });
        }
    }
}

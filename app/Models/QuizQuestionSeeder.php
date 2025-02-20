<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Faker\Factory as Faker;

class QuizQuestionSeeder extends Model
{

    // public function run(){

    //     $faker = Faker::create();

    //     $videoUrls = [
    //         'https://youtu.be/bhMjn3coMcE?si=RKFJ7aENSAK0uttx',
    //         'https://youtu.be/SAb4zRyxrD4?si=3QqxDrMvlwvhix7D',
    //         'https://youtu.be/ShJw2I8cgBE?si=ntcUMuT5vT0nMtax',
    //         'https://youtu.be/thAIw6vhchw?si=BQr6DXk6Tb2oQ2Nk',
    //         'https://youtu.be/H58vbez_m4E?si=R8oLjzyKnvWpX1ye',
    //         'https://youtu.be/dQw4w9WgXcQ?
    //         si=1ZrkLC5dp6LMiymt'
    //     ];

    //     $quizzes = Quiz::all();

    //     $quizzes->each(function($quiz){
    //         foreach(range(1,5) as $order){
    //             $options = [
    //                 $faker->country(),
    //                 $faker->country(),
    //                 $faker->country(),
    //                 $faker->country(),
    //             ];

    //             QuizQuestion::factory()->create([
    //                 'question_number' => $order,
    //                 'text' => $questionData['text'],
    //                 'question_image_url' => $questionImagePath,
    //                 'text_explanation' => $questionData['text_explanation'],
    //                 'video_explanation_url' => $questionData['video_explanation_url'] ?? null,
    //                 'image_explanation_url' => $imageExplanationPath,
    //                 'options' => $options,
    //                 'answer' => $answer,
    //             ]);
    //         }
    //     });
 
    // }

}

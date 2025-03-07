<?php

namespace Database\Seeders;

use App\Http\Resources\Api\ExamCourseTypeResource;
use App\Models\Exam;
use App\Models\ExamCourse;
use App\Models\ExamType;
use App\Models\ExamYear;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Exam::query()->delete();
        if(Exam::count() === 0) {
           $examTypes = ExamType::all();
           $examYears = ExamYear::all();
           $examCourses = ExamCourse::all();

            foreach ($examTypes as $examType) {
                foreach ($examCourses as $examCourse) {
                    foreach ($examYears as $examYear) {

                        // Generate base prices
                        $priceOneMonth = rand(50, 200);
                        $priceThreeMonth = $priceOneMonth * 2.5;
                        $priceSixMonth = $priceOneMonth * 4.5;
                        $priceOneYear = $priceOneMonth * 8;

                        // Generate discount prices (on sale) ensuring they are lower than the original price
                        $onSaleOneMonth = round($priceOneMonth * (rand(75, 95) / 100), 2);
                        $onSaleThreeMonth = round($priceThreeMonth * (rand(75, 95) / 100), 2);
                        $onSaleSixMonth = round($priceSixMonth * (rand(75, 95) / 100), 2);
                        $onSaleOneYear = round($priceOneYear * (rand(75, 95) / 100), 2);

                        Exam::factory()->create([
                            'exam_type_id' => $examType->id,
                            'exam_year_id' => $examYear->id,
                            'exam_course_id' => $examCourse->id,
                            'price_one_month' => $priceOneMonth,
                            'price_three_month' => $priceThreeMonth,
                            'price_six_month' => $priceSixMonth,
                            'price_one_year' => $priceOneYear,
                            'on_sale_one_month' => $onSaleOneMonth,
                            'on_sale_three_month' => $onSaleThreeMonth,
                            'on_sale_six_month' => $onSaleSixMonth,
                            'on_sale_one_year' => $onSaleOneYear,
                            // 'price_one_month' => $exam
                        ]);
                    }
                }
            }

        }
    }
}

<?php 

namespace Database\Seeders;

use App\Models\Exam;
use App\Models\ExamType;
use App\Models\ExamYear;
use App\Models\ExamCourse;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Exam::query()->delete();

        // List of exam types that don't need `exam_course_id`
        $noExamGradeTypes = ['NGAT', 'SAT', 'UAT', 'EXIT', 'EXAM'];

        if (Exam::count() === 0) {
            $examTypes = ExamType::all();
            $examYears = ExamYear::all();

            foreach ($examTypes as $examType) {
                foreach ($examYears as $examYear) {
                    // Generate base prices
                    $priceOneMonth = rand(50, 200);
                    $priceThreeMonth = $priceOneMonth * 2.5;
                    $priceSixMonth = $priceOneMonth * 4.5;
                    $priceOneYear = $priceOneMonth * 8;

                    // Generate discount prices (on sale)
                    $onSaleOneMonth = round($priceOneMonth * (rand(75, 95) / 100), 2);
                    $onSaleThreeMonth = round($priceThreeMonth * (rand(75, 95) / 100), 2);
                    $onSaleSixMonth = round($priceSixMonth * (rand(75, 95) / 100), 2);
                    $onSaleOneYear = round($priceOneYear * (rand(75, 95) / 100), 2);

                    // Handle cases where `exam_course_id` is not needed
                    if (in_array($examType->name, $noExamGradeTypes)) {
                        Exam::factory()->create([
                            'exam_type_id' => $examType->id,
                            'exam_year_id' => $examYear->id,
                            'price_one_month' => $priceOneMonth,
                            'price_three_month' => $priceThreeMonth,
                            'price_six_month' => $priceSixMonth,
                            'price_one_year' => $priceOneYear,
                            'on_sale_one_month' => $onSaleOneMonth,
                            'on_sale_three_month' => $onSaleThreeMonth,
                            'on_sale_six_month' => $onSaleSixMonth,
                            'on_sale_one_year' => $onSaleOneYear,
                        ]);
                    } else {
                        // For other types, use `exam_course_id`
                        $examCourses = ExamCourse::all();
                        foreach ($examCourses as $examCourse) {
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
                            ]);
                        }
                    }
                }
            }
        }
    }
}

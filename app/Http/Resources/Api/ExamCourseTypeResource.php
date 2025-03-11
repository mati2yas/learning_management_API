<?php

namespace App\Http\Resources\Api;

use App\Models\Exam;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamCourseTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();
        return [
            'id' => $this->id,
            'course_name' => $this->course_name,
            'exam_years' => $this->getUniqueExamYears($user),
        ];
    }

    /**
     * Extract unique exam years with their respective exam question count.
     */
    private function getUniqueExamYears(User $user): array
    {
        return $this->examQuestions
            ->groupBy('exam_year_id')
            ->map(function ($questions, $yearId) use ($user) {
                $firstQuestion = $questions->first(); // Get the first question safely
    
                if (!$firstQuestion) {
                    return [
                        'id' => $yearId,
                        'year_name' => null,
                        'exam_sheet_id' => null,
                        'exam_questions_count' => 0,
                        'is_paid' => false,
                    ];
                }
    
                $examYear = $firstQuestion->examYear; // Get examYear
                $exam = Exam::find($firstQuestion->exam_id); // Get exam instance
    
                if (!$exam) {
                    return [
                        'id' => $yearId,
                        'year_name' => optional($examYear)->year,
                        'exam_sheet_id' => null,
                        'exam_questions_count' => $questions->count(),
                        'is_paid' => false,
                    ];
                }
    
                $isPaid = $exam->paidExams()->where('user_id', $user->id)->exists();
    
                return [
                    'id' => $yearId,
                    'year_name' => optional($examYear)->year,
                    'exam_sheet_id' => $exam->id,
                    'exam_questions_count' => $questions->count(),
                    'price_one_month' => $exam->price_one_month,
                    'price_three_month' => $exam->price_three_month,
                    'price_six_month' => $exam->price_six_month,
                    'price_one_year' => $exam->price_one_year,
                    'on_sale_one_month' => $exam->on_sale_one_month,
                    'on_sale_three_month' => $exam->on_sale_three_month,
                    'on_sale_six_month' => $exam->on_sale_six_month,
                    'on_sale_one_year' => $exam->on_sale_one_year,
                    'is_paid' => $isPaid,
                ];
            })
            ->values()
            ->all();
    }
    
    


}

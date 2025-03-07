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
            ->groupBy('exam_year_id') // Group questions by exam_year_id
            ->map(function ($questions, $yearId) use ($user) {
                $examYear = $questions->first()->examYear; // Get the first examYear instance
                $exam = Exam::find($questions->first()->exam_id); // Get the first exam instance 

                dd($exam);

                $isPaid = $exam->paidExams()->where('user_id', $user)->exists(); // Check if the user has paid for this exam

                return [
                    'id' => $yearId,
                    'year_name' => optional($examYear)->year, // Handle possible null examYear
                    'exam_questions_count' => $questions->count(), // Count questions in this year
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

    protected function isPaidByUser(int $userId): bool
    {
        return $this->paidExams()->where('user_id', $userId)->exists();
    }
}

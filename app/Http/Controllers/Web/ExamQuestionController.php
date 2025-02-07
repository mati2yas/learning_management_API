<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ExamQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ExamQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    
    public function store(Request $request)
    {
        // Log::info('Received exam question data:', $request->all());
    
        try {
            $validatedData = $request->validate([
                'exam_type_id' => 'required|exists:exam_types,id',
                'exam_year_id' => 'required|exists:exam_years,id',
                'exam_course_id' => 'required|exists:exam_courses,id',
                'exam_grade_id' => 'required_if:exam_type_id,!=,ngat|exists:exam_grades,id',
                'exam_chapter_id' => 'required_if:exam_type_id,!=,ngat|exists:exam_chapters,id',

                'questions' => 'required|array|min:1',

                'questions.*.question_text' => 'required|string',
                'questions.*.text_explanation' => 'required|string',
                'questions.*.video_explanation_url' => 'nullable|url',
                'questions.*.options' => 'required|array|min:2',
                'questions.*.options.*' => 'required|string',
                'questions.*.answer' => 'required|array|min:1',
                'questions.*.answer.*' => 'required|string',
            ]);
    
            // Log::info('Validated data:', $validatedData);
    
            // $createdQuestions = [];
    
            foreach ($validatedData['questions'] as $questionData) {
                $attrs = [
                    'exam_type_id' => $validatedData['exam_type_id'],
                    'exam_year_id' => $validatedData['exam_year_id'],
                    'exam_course_id' => $validatedData['exam_course_id'],
                    'exam_grade_id' => $validatedData['exam_grade_id'] ?? null,
                    'exam_chapter_id' => $validatedData['exam_chapter_id'] ?? null,
                    'question_text' => $questionData['question_text'],
                    'text_explanation' => $questionData['text_explanation'],
                    'video_explanation_url' => $questionData['video_explanation_url'] ?? null,
                    'options' => json_encode($questionData['options']),
                    'answer' => json_encode($questionData['answer']),
                ];
    
                Log::info('Creating question with attributes:', $attrs);
    
                $question = ExamQuestion::create($attrs);
                $question->created_by = $request->user()->id;
                $question->updated_by = $request->user()->id;

                $question->save();
                // $createdQuestions[] = $question;
            }
    
            return redirect()->route('exams.index')->with('success', 'Exam questions created successfully');
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error:', $e->errors());
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating exam questions:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'An error occurred while creating exam questions')->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ExamQuestion $examQuestion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExamQuestion $examQuestion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ExamQuestion $examQuestion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExamQuestion $examQuestion)
    {
        $examChapter = $examQuestion->examChapter->title;

        $examQuestion->delete();

        return redirect()->route('exams.index')->with('success', 'Exam question of course '.$examChapter.'deleted successfully');
    }
}

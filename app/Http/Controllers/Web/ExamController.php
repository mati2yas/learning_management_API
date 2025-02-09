<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ExamChapter;
use App\Models\ExamCourse;
use App\Models\ExamGrade;
use App\Models\ExamQuestion;
use App\Models\ExamType;
use App\Models\ExamYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ExamQuestion::query();

        if($request->filled('examCourse')){
            $query->where('exam_course_id', $request->input('examCourse'));
        }

        if ($request->filled('examType')) {
            $query->where('exam_type_id', $request->input('examType'));
        }

        if ($request->filled('year')) {
            $query->where('exam_year_id', $request->input('year'));
        }

        if ($request->filled(key: 'search')) {
            $query->where('question_text', 'like', '%' . $request->search . '%');
        }


        $exam_questions = $query->latest()->paginate(perPage: 30);

        // dd($exam_questions);


        return Inertia::render('Exams/Index',[
            'exam_questions' => $exam_questions,
            // 'exam_chapters' => ExamChapter::all(),
            'exam_years' => ExamYear::all(),
            'exam_types' => ExamType::all(),
            'exam_grades' => ExamGrade::all(),
            'exam_courses' => ExamCourse::all(),
            'filters' => $request->only(['search','year','examType', 'examCourse']),

            'canAddExamQuestions' => Auth::user()->hasDirectPermission('add exam questions'),
            'canUpdateExamQuestions' => Auth::user()->hasDirectPermission('update exam questions'),
            'canDeleteExamQuestions' => Auth::user()->hasDirectPermission('delete exam questions'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {

        // dd($examQuestion);

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $examQuestion = ExamQuestion::findOrFail($id);

        // dd($examQuestion);
        return Inertia::render('Exams/EditExam', [
            'exam_years' => ExamYear::all(),
            'exam_grades' => ExamGrade::all(),
            'exam_types' => ExamType::all(),
            'question' => $examQuestion
        ]);
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
        //
    }
}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ExamQuestion;
use Illuminate\Http\Request;

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
        // dd($request->all());
        $attrs = $request->validate([
            'exam_type_id' => 'required',
            'exam_year_id' => '',
            'exam_course_id' => '',
            'exam_chapter_id' => '',
            'video_explanation_url' => '',
            'question_image_url' => 'nullable|image|max:2048',
            'question_text' => 'required|string',
            'text_explanation' => 'required|string',
            'options' => 'required',
            'answer' => 'required'
        ]);

        if ($request->hasFile('question_image_url')) {
            $path = $request->file('question_image_url')->store('exam_question_images', 'public');
            $attrs['question_image_url'] =  $path;
        }

        $attrs['options'] = is_string($attrs['options']) ? $attrs['options'] : json_encode($attrs['options']);

        $attrs['answer'] = is_string($attrs['answer']) ? $attrs['answer'] : json_encode($attrs['answer']);

        // dd($attrs);
        ExamQuestion::create($attrs);

        // dd($attrs);

        return redirect()->route('exams.index')->with('Success', "Course is created successfully");

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
        //
    }
}

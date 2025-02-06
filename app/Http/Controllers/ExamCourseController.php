<?php

namespace App\Http\Controllers;

use App\Models\ExamCourse;
use Illuminate\Http\Request;

class ExamCourseController extends Controller
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $attrs = $request->validate([
            'course_name' => 'required|string',
            'exam_type_id' => 'nullable|exists:exam_types,id',
            'exam_grade_id' => 'nullable|exists:exam_grades,id',
            'exam_chapters' => 'nullable|array',
            'exam_chapters.*.title' => 'nullable|string',
            'exam_chapters.*.sequence_order' => 'nullable|numeric',
        ]);

        $examCourse = ExamCourse::create([
            'course_name' => $request->course_name,
            'exam_type_id' => $request->exam_type_id,
            'exam_grade_id' => $request->exam_grade_id,
        ]);

        foreach($attrs['exam_chapters'] as $chapter){
            $examCourse->examChapters()->create([
                'title' => $chapter['title'],
                'sequence_order' => $chapter['sequence_order']
            ]);
        }

        return redirect()->route('exams.index')->with('success', 'Exam Course/Chapter add successfully.');
        
    }

    /**
     * Display the specified resource.
     */
    public function show(ExamCourse $examCourse)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExamCourse $examCourse)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ExamCourse $examCourse)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExamCourse $examCourse)
    {
        //
    }
}

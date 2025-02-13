<?php

namespace App\Http\Controllers;

use App\Models\ExamCourse;
use App\Models\ExamGrade;
use App\Models\ExamType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExamCourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // dd(ExamCourse::all());
        // return Inertia::render('Exams/ExamCourseList',[
        //     'examCourses' => ExmamCourse::all(),
        // ]);

        $query= ExamCourse::query();

        if ($request->filled('examType')) {
            $query->where('exam_type_id', $request->input('examType'));
        }

        if ($request->filled(key: 'search')) {
            $query->where('course_name', 'like', '%' . $request->search . '%');
        }

        $exam_courses = $query->with(['examGrade','examType','examChapters'])->latest()->get();

        // dd($exam_courses);

        return inertia("Exam-Course/Index",[
            'examCourses' => $exam_courses,
            'examTypes' => ExamType::all(),
            'examGrades' => ExamGrade::all(),
            'session' => session('success'),
            'canAddExamCourse' => Auth::user()->hasDirectPermission('add exam courses'),
            'canUpdateExamCourse' => Auth::user()->hasDirectPermission('update exam courses'),
            'canDeleteExamCourse' => Auth::user()->hasDirectPermission('delete exam courses'),
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

        return redirect()->route('exam-courses.index')->with('success', 'Exam Course/Chapter add successfully.');
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
        $attrs = $request->validate([
            'course_name' => 'required|string',
            'exam_type_id' => 'nullable|exists:exam_types,id',
            'exam_grade_id' => 'nullable|exists:exam_grades,id',
            'exam_chapters' => 'nullable|array',
            'exam_chapters.*.id' => 'nullable|exists:exam_chapters,id',
            'exam_chapters.*.title' => 'nullable|string',
            'exam_chapters.*.sequence_order' => 'nullable|numeric',
        ]);
    
        $examCourse->update([
            'course_name' => $request->course_name,
            'exam_type_id' => $request->exam_type_id,
            'exam_grade_id' => $request->exam_grade_id,
        ]);
    
        // Get the IDs of chapters sent in the request
        $sentChapterIds = collect($attrs['exam_chapters'])->pluck('id')->filter()->toArray();
    
        // Delete chapters that are not in the request (removed by the user)
        $examCourse->examChapters()->whereNotIn('id', $sentChapterIds)->delete();
    
        foreach ($attrs['exam_chapters'] as $chapter) {
            if (isset($chapter['id'])) {
                // Update existing chapter
                $examCourse->examChapters()->where('id', $chapter['id'])->update([
                    'title' => $chapter['title'],
                    'sequence_order' => $chapter['sequence_order']
                ]);
            } else {
                // Create new chapter
                $examCourse->examChapters()->create([
                    'title' => $chapter['title'],
                    'sequence_order' => $chapter['sequence_order']
                ]);
            }
        }
    
        return redirect()->route('exam-courses.index')->with('success', 'Exam Course/Chapter updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExamCourse $examCourse)
    {
        $examCourseDeleted = $examCourse->course_name;

        $examCourse->delete();

        return redirect()->route('exam-courses.index')->with('success', 'Exam Course '.$examCourseDeleted.'Chapter updated successfully.');

    }
}

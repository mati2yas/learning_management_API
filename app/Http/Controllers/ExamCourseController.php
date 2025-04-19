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
        $query= ExamCourse::query();

        if ($request->filled('examType')) {
            $query->where('exam_type_id', $request->input('examType'));
        }

        if ($request->filled(key: 'search')) {
            $query->where('course_name', 'like', '%' . $request->search . '%');
        }

        

        $exam_courses = $query->with(['examGrade','examType','examChapters'])->orderBy('course_name','asc')->get();

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
        // First, validate the basic fields
        $attrs = $request->validate([
            'exam_type_id' => 'required|exists:exam_types,id',
            'exam_grade_id' => 'nullable|exists:exam_grades,id',
            'stream' => 'nullable|in:natural,social',
            'exam_course_id' => 'nullable|exists:exam_courses,id',
            'course_name' => 'required_without:exam_course_id|string|max:100',
            'exam_chapters' => 'nullable|array',
            'exam_chapters.*.title' => 'required|string',
            'exam_chapters.*.sequence_order' => 'nullable|numeric',
        ],[
            'exam_type_id.required' => 'The exam type field is mandatory',
            'exam_chapters.*.title.required' => 'The chapter title is a required field.',
            'course_name.required_without' => 'The course name is required when creating a new course.'
        ]);
    
        // If exam_course_id is provided, use existing course
        if ($request->exam_course_id) {
            $examCourse = ExamCourse::findOrFail($request->exam_course_id);
        } else {
            // STRICT VALIDATION: Check for duplicate course name + exam type + exam grade combination
            
            // Start with a base query
            $duplicateQuery = ExamCourse::where('course_name', $request->course_name)
                                       ->where('exam_type_id', $request->exam_type_id);
            
            // Add exam_grade_id condition - handle both when it's provided and when it's null
            if ($request->filled('exam_grade_id')) {
                $duplicateQuery->where('exam_grade_id', $request->exam_grade_id);
            } else {
                $duplicateQuery->whereNull('exam_grade_id');
            }
            
            // Add stream condition if applicable
            if ($request->filled('stream')) {
                $duplicateQuery->where('stream', $request->stream);
            } else {
                $duplicateQuery->whereNull('stream');
            }
            
            // Check if this exact combination already exists
            if ($duplicateQuery->exists()) {
                // Log the query for debugging if needed
                // Log::info($duplicateQuery->toSql());
                // Log::info($duplicateQuery->getBindings());
                // dd('biruk');
                
                return redirect()->route('exam-courses.index')->with(
                    'error', 'A course with this exact name, exam type, and grade already exists. Duplicate courses are not allowed.'
                );
            }
            
            // Create new course only if no duplicate exists
            $examCourse = ExamCourse::create([
                'course_name' => $request->course_name,
                'exam_type_id' => $request->exam_type_id,
                'exam_grade_id' => $request->filled('exam_grade_id') ? $request->exam_grade_id : null,
                'stream' => $request->filled('stream') ? $request->stream : null
            ]);
        }
    
        // Add chapters if provided
        if (!empty($attrs['exam_chapters'])) {
            foreach($attrs['exam_chapters'] as $chapter){
                $examCourse->examChapters()->create([
                    'title' => $chapter['title'],
                    'sequence_order' => $chapter['sequence_order']
                ]);
            }
        }
    
        return redirect()->route('exam-courses.index')->with('success', 'Exam Course/Chapter added successfully.');
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
            'course_name' => 'required|string|max:100',
            'stream' => 'nullable|in:natural,social',
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
            'stream' => $request->stream ? $request->stream : null
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

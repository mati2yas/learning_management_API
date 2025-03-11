<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamNewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Exams-New/Index', [
            'exam_types' => ExamType::all(),
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
            'exam_type_id' => 'required',
            'exam_course_id' => 'required',
            'exam_year_id' => 'required',
            'exam_duration' => 'required',
            'price_one_month' => 'required|numeric|max:999999.99',
            'price_three_month' => 'required|numeric|max:999999.99',
            'price_six_month' => 'required|numeric|max:999999.99',
            'price_one_year' => 'required|numeric|max:999999.99',
            'on_sale_one_month' => 'required|numeric|max:999999.99',
            'on_sale_three_month' => 'required|numeric|max:999999.99',
            'on_sale_six_month' => 'required|numeric|max:999999.99',
            'on_sale_one_year' => 'required|numeric|max:999999.99',
            'stream' => 'nullable',
        ]);

        Exam::create($attrs);

        return redirect()->back()->with('success', 'Exam created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, String $id)
    {
        $examType = ExamType::findOrFail($id);
    
        // Get filters from request
        $search = $request->input('search');
        $courseId = $request->input('course_id');
        $yearId = $request->input('year_id');
    
        // Query exams with relationships
        $query = Exam::where('exam_type_id', $examType->id)
            ->with(['examCourse', 'examYear', 'examType']);
    
        // Apply search filter (searching by course_name)
        if ($search) {
            $query->whereHas('examCourse', function ($q) use ($search) {
                $q->where('course_name', 'LIKE', "%{$search}%");
            });
        }
    
        // Apply course filter
        if ($courseId) {
            $query->where('exam_course_id', $courseId);
        }
    
        // Apply year filter
        if ($yearId) {
            $query->where('exam_year_id', $yearId);
        }
    
        // Fetch filtered exams with pagination
        $exams = $query->latest()->paginate(10);
    
        // Collect all unique exam courses and years from the filtered exams
        $examCourses = $exams->pluck('examCourse')->unique('id')->values();
        $examYears = $exams->pluck('examYear')->unique('id')->values();
    
        return Inertia::render('Exams-New/Show', [
            'exams' => $exams,
            'courses' => $examCourses, // Unique courses from filtered exams
            'years' => $examYears, // Unique years from filtered exams
            'filters' => [
                'search' => $search,
                'course_id' => $courseId,
                'year_id' => $yearId,
            ],
            'examTypeId' => $id,
        ]);
    }
    
    
    

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exam $exam)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exam $exam)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        //
    }
}

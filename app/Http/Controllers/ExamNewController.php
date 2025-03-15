<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamCourse;
use App\Models\ExamType;
use App\Models\ExamYear;
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
            'on_sale_one_month' => 'nullable|numeric|max:999999.99',
            'on_sale_three_month' => 'nullable|numeric|max:999999.99',
            'on_sale_six_month' => 'nullable|numeric|max:999999.99',
            'on_sale_one_year' => 'nullable|numeric|max:999999.99',
            'stream' => 'nullable',
        ]);

       $exam = Exam::create($attrs);

        return redirect()->route('exams-new.show', $exam->exam_type_id )->with('success', 'Exam created successfully.');
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
    
        // Base query for all exams under the given exam type
        $baseQuery = Exam::where('exam_type_id', $examType->id);
    
        // Retrieve all distinct courses and years related to this exam type
        $allCourses = ExamCourse::where('exam_type_id', $examType->id)->get();

        // dd($allCourses);

        $allYears = ExamYear::all();
    
        // Apply filters to the query
        $query = $baseQuery->with(['examCourse', 'examYear', 'examType']);
    
        if ($search) {
            $query->whereHas('examCourse', function ($q) use ($search) {
                $q->where('course_name', 'LIKE', "%{$search}%");
            });
        }
    
        if ($courseId) {
            $query->where('exam_course_id', $courseId);
        }
    
        if ($yearId) {
            $query->where('exam_year_id', $yearId);
        }
    
        // Fetch filtered exams with pagination
        $exams = $query->latest()->paginate(10);
    
        // Collect unique courses and years from the filtered exams
        $filteredCourses = $exams->pluck('examCourse')->unique('id')->values();

        // dd($filteredCourses);

        $filteredYears = $exams->pluck('examYear')->unique('id')->values();
    
        return Inertia::render('Exams-New/Show', [
            'exams' => $exams,
            'examTypeName' => $examType->name,
            'filteredCourses' => $filteredCourses, // Unique courses from filtered exams
            'filteredYears' => $filteredYears, // Unique years from filtered exams
            'courses' => $allCourses, // All courses from this exam type
            'years' => $allYears, // All years from this exam type
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
    public function update(Request $request, String $id)
    {

        $exam = Exam::findOrFail($id);
        // dd($exam);

        $attrs = $request->validate([
            'exam_type_id' => 'required',
            'exam_course_id' => 'required',
            'exam_year_id' => 'required',
            'exam_duration' => 'required',
            'price_one_month' => 'required|numeric|max:999999.99',
            'price_three_month' => 'required|numeric|max:999999.99',
            'price_six_month' => 'required|numeric|max:999999.99',
            'price_one_year' => 'required|numeric|max:999999.99',
            'on_sale_one_month' => 'nullable|numeric|max:999999.99',
            'on_sale_three_month' => 'nullable|numeric|max:999999.99',
            'on_sale_six_month' => 'nullable|numeric|max:999999.99',
            'on_sale_one_year' => 'nullable|numeric|max:999999.99',
            'stream' => 'nullable',
        ]);

        foreach (['one_month', 'three_month', 'six_month', 'one_year'] as $duration) {
            $onSaleKey = "on_sale_$duration";
            if (!isset($attrs[$onSaleKey]) || $attrs[$onSaleKey] === '') {
                $attrs[$onSaleKey] = null;
            }
        }

        $exam->update($attrs);

        return to_route('exams-new.show', $exam->exam_type_id)->with('success', 'Exam updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(String $id)
    {
        $exam = Exam::findOrFail($id);
        $exam_type_id = $exam->exam_type_id;
    
        // Use a fallback in case course_name is not available
        $course_name = $exam->examCourse->course_name ?? 'Unknown Course';
    
        $exam->delete();
    
        return redirect()->route('exams-new.show', $exam_type_id)
                         ->with('success', 'Exam ' . $course_name . ' deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamCourse;
use App\Models\ExamType;
use App\Models\ExamYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExamNewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exam_types = ExamType::with([
            'exams.examYear',   // Load exam year
            'exams.examCourse', // Load exam course
            'exams.examQuestions',
            'exams.paidExams.user',
        ])->get();
    
        // Transform the data to include the total counts
        $exam_types = $exam_types->map(function ($examType) {
            return [
                'id' => $examType->id,
                'name' => $examType->name,
                'total_exams' => $examType->exams->count(),
                'total_exam_courses' => $examType->exams->sum(fn($exam) => $exam->examCourse ? 1 : 0), // Count courses
                'total_exam_questions' => $examType->exams->sum(fn($exam) => $exam->examQuestions->count()), 
                'total_years' => $examType->exams->sum(fn($exam) => $exam->examYear ? 1 : 0),// Sum questions
                'total_users' => $examType->exams->sum(fn($exam) => $exam->paidExams->count()), // Sum users
            ];
        });
    
        return Inertia::render('Exams-New/Index', [
            'exam_types' => $exam_types,
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
            'exam_duration' => 'nullable',
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
        $sort = $request->input('sort'); // Get sort parameter
    
        // Base query for all exams under the given exam type
        $baseQuery = Exam::where('exams.exam_type_id', $examType->id); // Specify table name
    
        // Retrieve all distinct courses and years related to this exam type
        $allCourses = ExamCourse::where('exam_type_id', $examType->id)
                        ->orderBy('course_name', 'asc')
                        ->get();
    
        $allYears = ExamYear::all();
    
        // Apply filters to the query
        $query = $baseQuery->with(['examCourse', 'examYear', 'examType']);
    
        if ($search) {
            $query->whereHas('examCourse', function ($q) use ($search) {
                $q->where('course_name', 'LIKE', "%{$search}%");
            });
        }
    
        if ($courseId) {
            $query->where('exams.exam_course_id', $courseId); // Specify table name
        }
    
        if ($yearId) {
            $query->where('exams.exam_year_id', $yearId); // Specify table name
        }
    
        // Join with exam_courses table to enable sorting by course name
        $query->join('exam_courses', 'exams.exam_course_id', '=', 'exam_courses.id')
              ->select('exams.*');
    
        // Apply sorting based on the sort parameter
        if ($sort === 'asc') {
            $query->orderBy('exam_courses.course_name', 'asc');
        } elseif ($sort === 'desc') {
            $query->orderBy('exam_courses.course_name', 'desc');
        } else {
            // Default sorting (latest first)
            $query->orderBy('exams.created_at', 'desc');
        }
    
        // Fetch filtered exams with pagination
        $exams = $query->paginate(10);
    
        // Collect unique courses and years from the filtered exams
        $filteredCourses = $exams->pluck('examCourse')->unique('id')->values();
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
                'sort' => $sort, // Include sort in filters
            ],
            'examTypeId' => $id,
            'canAdd' => Auth::user()->hasDirectPermission('add exams'),
            'canUpdate' => Auth::user()->hasDirectPermission('update exams'),
            'canDelete' => Auth::user()->hasDirectPermission('delete exams')
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
            'exam_duration' => 'nullable',
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

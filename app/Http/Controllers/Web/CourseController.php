<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\Web\CourseResource;
use App\Models\Batch;
use App\Models\Category;
use App\Models\Course;
use App\Models\Department;
use App\Models\Grade;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Course::with([
            'category:id,name',
            'grade:id,grade_name',
            'department:id,department_name',
            'batch:id,batch_name',
            'createdBy:id,name',
            'updatedBy:id,name',
            'saves',
            'likes',
            'paidCourses',
            'chapters:id,course_id'
        ]);
    
        if ($request->filled('category')) {
            $query->where('category_id', $request->input('category'));
        }
    
        if ($request->filled('search')) {
            $query->where('course_name', 'like', '%' . $request->search . '%');
        }
    
        $courses = $query->latest()->paginate(16);

        // dd($courses);
    
    
        return Inertia::render('courses/Index', [
            'categories' => Category::all(),
            'grades' => Grade::all(),
            'departments' => Department::all(),
            'batches' => Batch::all(),
            'courses' => CourseResource::collection($courses) , // Pagination metadata is preserved
            'filters' => $request->only(['category', 'search']),
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
            'course_name' => 'required|max:100',
            'category_id' => 'required',
            'grade_id' => '',
            'department_id' => '',
            'batch_id'=> [""],
            // 'number_of_chapters'=> ['required'],
            'price_one_month' => 'required',
            'on_sale_one_month' => '',
            'price_three_month' => 'required',
            'on_sale_three_month' => '',
            'price_six_month' => 'required',
            'on_sale_six_month' => '',
            'price_one_year' => 'required',
            'on_sale_one_year' => '',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnail', 'public'); // Store in "storage/app/public/thumbnail"
            $attrs['thumbnail'] = $path; // Add the path to attributes to save in the database
        }

        $attrs['created_by'] = Auth::user()->id;
        $attrs['updated_by'] = Auth::user()->id;

        $course = Course::create($attrs);

        return redirect()->route('courses.index')->with('success', 'Course created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {

        $thumbnail = Storage::url($course->thumbnail);

        $category_name = Category::findOrFail($course->category_id)->name;

        $department_name = '';
        $batch_name = '';

        if($course->department_id && $course->batch_id){
            $department_name = Department::findOrFail($course->department_id)->department_name;

            $batch_name = Batch::findOrFail($course->batch_id)->batch_name;
        }

        $chapters = $course->chapters()->withCount('contents')->get();


        return Inertia::render('courses/Show', [
            'course' => $course,
            'thumbnail' => $thumbnail,
            'category_name' => $category_name,
            'department_name' => $department_name,
            'batch_name' => $batch_name,
            'chapters' => $chapters,
            'categories' => Category::all(),
            'grades' => Grade::all(),
            'departments' => Department::all(),
            'batches' => Batch::all(),
            'enrolledStudents' => $course->paidCourses->count(),
            'chaptersCount' => $course->chapters->count(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $messages = [
            'thumbnail.max' => 'The thumbnail must not be larger than 5MB.',
        ];
       
        $attrs = $request->validate([
            'course_name' => 'required|max:100',
            'category_id' => 'required',
            'grade_id' => 'nullable',
            'department_id' => 'nullable',
            'batch_id' => 'nullable',
            'price_one_month' => 'required',
            'on_sale_one_month' => '',
            'price_three_month' => 'required',
            'on_sale_three_month' => '',
            'price_six_month' => 'required',
            'on_sale_six_month' => '',
            'price_one_year' => 'required',
            'on_sale_one_year' => '',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], $messages);
    
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnail', 'public'); 
            $attrs['thumbnail'] = $path;
        }

        $attrs['updated_by'] = Auth::user()->id;
    
        $course->update($attrs);
    
        return redirect()->route('courses.show', $course->id)->with('success', 'Course updated successfully');
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course_name = $course->course_name;
        $course->delete();
        return redirect()->route('courses.index')->with('success', 'Course ' . $course_name . ' deleted successfully');
    }
}

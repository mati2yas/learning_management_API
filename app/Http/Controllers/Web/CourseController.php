<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Category;
use App\Models\Course;
use App\Models\Department;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('courses/Index',[
            'categories' => Category::all(),
            'grades' => Grade::all(),
            'departments' => Department::all(),
            'batches' => Batch::all(),
            'courses' => Course::all(),
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
            'number_of_chapters'=> ['required'],
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnail', 'public'); // Store in "storage/app/public/thumbnail"
            $attrs['thumbnail'] = $path; // Add the path to attributes to save in the database
        }

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



        return Inertia::render('courses/Show', [
            'course' => $course,
            'thumbnail' => $thumbnail,
            'category_name' => $category_name,
            'department_name' => $department_name,
            'batch_name' => $batch_name,
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChapterController extends Controller
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
            'course_id' => 'required',
            'order' => 'required',
            'title' => 'required',
        ]);

        $chapter = Chapter::create($attrs);

        $chapter->course->increment('number_of_chapters');


 
        return redirect()->route('courses.show', $chapter->course_id);
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Chapter $chapter)
    {
        // dd($chapter);
        return Inertia::render('Chapters/Show', 
        // props: [
        //     'chapter' => $chapter,
        //     'contents' => $chapter->contents,
        // ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Chapter $chapter)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Chapter $chapter)
    {
        $attrs = $request->validate([
            'course_id' => 'required',
            'order' => 'required',
            'title' => 'required',
        ]);

        $chapter->update($attrs);


        return to_route('courses.show', $chapter->course_id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chapter $chapter)
    {
        $course_id = $chapter->course_id;
        $chapter->delete();

        return to_route('courses.show', $course_id);
    }
}

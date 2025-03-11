<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'description' => 'nullable',
        ]);

        $chapter = Chapter::create($attrs);
 
        return redirect()->route('courses.show', $chapter->course_id)->with('success', 'Chapter created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Chapter $chapter)
    {
        return Inertia::render('Chapters/Show', 
        props: [
            'chapter' => $chapter,
            'contents' => $chapter->contents,
            'quizzes' => $chapter->quizzes,
            'course_id' => $chapter->course_id,
            'contentsCount' => $chapter->contents->count(),
            'quizzesCount' => $chapter->quizzes->count(),

            'canDeleteContents' => Auth::user()->hasDirectPermission('delete content'),
            'canAddContents' => Auth::user()->hasDirectPermission('add content'),
            'canUpdateContents' => Auth::user()->hasDirectPermission('update content'),
            'canViewContents' => Auth::user()->hasDirectPermission('can view contents'),
            
            'canAddQuizzes' => Auth::user()->hasDirectPermission('add quizzes'),

            'canUpdateQuizzes' => Auth::user()->hasDirectPermission('update quizzes'),

            'canDeleteQuizzes' => Auth::user()->hasDirectPermission('delete quizzes'),

            'session' => session('success'),
        ]
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
            'description' => ''
        ]);

        $chapter->update($attrs);


        return to_route('courses.show', $chapter->course_id)->with('success', 'Chapter updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chapter $chapter)
    {

        // dd($chapter);
        $course_id = $chapter->course_id;
        $chapter->delete();

        return to_route('courses.show', $course_id)->with('success', 'Chapter deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
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
        $validated = $request->validate([
            'chapter_id' => 'required|exists:chapters,id',
            'quizzes' => 'required|array|min:1',
            'quizzes.*.title' => 'required|string|max:255',
        ]);
    
        $chapter = Chapter::findOrFail($validated['chapter_id']);
    
        $createdQuizzes = collect($validated['quizzes'])->map(function ($quizData) use ($chapter) {
            return $chapter->quizzes()->create($quizData);
        });
    
        return redirect()->route('chapters.show', $chapter->id)
                         ->with('success', 'Quizzes Created Successfully');
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Quiz $quiz)
    {
        $quiz_questions = $quiz->quizQuestions()->get();
        return Inertia::render('Quiz/Show',[
            'quiz' => $quiz,
            'quiz_questions' => $quiz_questions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Quiz $quiz)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Quiz $quiz)
    {
        $attrs = $request->validate([
            'chapter_id' => 'required',
            'title' => 'required|string', 
        ]);

        $quiz->update($attrs);

        return redirect()->route('chapters.show', $request->chapter_id)->with('success','Quizz Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quiz $quiz)
    {
        $title = $quiz->title;
        $chapter_id = $quiz->chapter_id;
        $quiz->delete();

        return redirect()->route('chapters.show', $chapter_id)->with('success','Quizz '.$title.' Delted Successfully');

    }
}

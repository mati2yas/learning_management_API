<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QuizQuesitonController extends Controller
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
            'quiz_id' => 'required|exists:quizzes,id',
            'question_number' => 'required|integer',
            'text' => 'required|string',
            'question_image_url' => 'nullable|image|max:2048', // 2MB Max
            'text_explanation' => 'required|string',
            'video_explanation_url' => 'nullable|url',
            'options' => 'required',  // Remove json validation as we'll handle it manually
            'answer' => 'required',   // Remove json validation as we'll handle it manually
        ]);
    
        try {
        // Handle file upload if present
        if ($request->hasFile('question_image_url')) {
            $path = $request->file('question_image_url')->store('question_images', 'public');
            $attrs['question_image_url'] =  $path;
        }
    
            // Ensure options and answer are properly encoded as JSON strings
            // Check if they're already JSON strings
            $attrs['options'] = is_string($attrs['options']) ? $attrs['options'] : json_encode($attrs['options']);
            $attrs['answer'] = is_string($attrs['answer']) ? $attrs['answer'] : json_encode($attrs['answer']);
    
            // Create the quiz question
            $quizQuestion = QuizQuestion::create($attrs);
    
            return redirect()->route('quizzes.show', $request->quiz_id)->with('success', 'Quiz Question Created Successfully.');
    
        } catch (\Exception $e) {
            Log::error('Quiz Question Creation Error:', [
                'error' => $e->getMessage(),
                'data' => $attrs
            ]);
    
            return redirect()->back()
                ->withErrors(['error' => 'Failed to create quiz question. Please try again.'])
                ->withInput();
        }
    

    }

    /**
     * Display the specified resource.
     */
    public function show(QuizQuestion $quizQuestion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(QuizQuestion $quizQuestion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, QuizQuestion $quizQuestion)
    {
        $attrs = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'question_number' => 'required|integer',
            'text' => 'required|string',
            'question_image_url' => 'nullable|image|max:2048', // 2MB Max
            'text_explanation' => 'required|string',
            'video_explanation_url' => 'nullable|url',
            'options' => 'required',  // Remove json validation as we'll handle it manually
            'answer' => 'required',   // Remove json validation as we'll handle it manually
        ]);
    
        try {
        // Handle file upload if present
        if ($request->hasFile('question_image_url')) {
            $path = $request->file('question_image_url')->store('question_images', 'public');
            $attrs['question_image_url'] =  $path;
        }
    
            // Ensure options and answer are properly encoded as JSON strings
            // Check if they're already JSON strings
            $attrs['options'] = is_string($attrs['options']) ? $attrs['options'] : json_encode($attrs['options']);
            $attrs['answer'] = is_string($attrs['answer']) ? $attrs['answer'] : json_encode($attrs['answer']);
    
            // Create the quiz question
            $quizQuestion->update($attrs);
    
            return redirect()->route('quizzes.show', $request->quiz_id)->with('success', 'Quiz Question Updated Successfully.');
    
        } catch (\Exception $e) {
            Log::error('Quiz Question Creation Error:', [
                'error' => $e->getMessage(),
                'data' => $attrs
            ]);
    
            return redirect()->back()
                ->withErrors(['error' => 'Failed to create quiz question. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QuizQuestion $quizQuestion)
    {
        $quiz_question_number = $quizQuestion->question_number;
        $quiz_id = $quizQuestion->quiz_id;
        $quizQuestion->delete();

        return redirect()->route('quizzes.show', $quiz_id)->with('success', 'Quiz Question Deleted Successfully.');
    }
}

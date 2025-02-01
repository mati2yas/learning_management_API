<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
            'questions' => 'required|array|min:1',
            'questions.*.question_number' => 'required|integer',
            'questions.*.text' => 'required|string',
            'questions.*.question_image' => 'nullable|image|max:2048',
            'questions.*.text_explanation' => 'required|string',
            'questions.*.video_explanation_url' => 'nullable|url',
            'questions.*.image_explanation' => 'nullable|image|max:2048',
            'questions.*.options' => 'nullable|array',
            'questions.*.options.*' => 'nullable|string',
            'questions.*.answer' => 'nullable|array',
            'questions.*.answer.*' => 'nullable|string',
        ]);
    
        foreach($attrs['questions'] as $questionData) {
            $questionImagePath = null;
            $imageExplanationPath = null;
    
            if (isset($questionData['question_image'])) {
                $questionImagePath = $questionData['question_image']->store('question_images', 'public');
            }
    
            if (isset($questionData['image_explanation'])) {
                $imageExplanationPath = $questionData['image_explanation']->store('explanation_images', 'public');
            }
    
            // Convert arrays to JSON before storing
            $options = isset($questionData['options']) ? json_encode($questionData['options']) : null;
            $answer = isset($questionData['answer']) ? json_encode($questionData['answer']) : null;
    
            $question = QuizQuestion::create([
                'quiz_id' => $request->quiz_id,
                'question_number' => $questionData['question_number'],
                'text' => $questionData['text'],
                'question_image_url' => $questionImagePath ? Storage::url($questionImagePath) : null,
                'text_explanation' => $questionData['text_explanation'],
                'video_explanation_url' => $questionData['video_explanation_url'] ?? null,
                'image_explanation_url' => $imageExplanationPath ? Storage::url($imageExplanationPath) : null,
                'options' => $options,
                'answer' => $answer,
            ]);
        }
    
        return redirect()->route('quizzes.show', $request->quiz_id)
            ->with('success', 'Quiz questions created successfully.');
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

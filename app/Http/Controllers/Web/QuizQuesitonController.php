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
            'questions.*.id' => 'required|string',
            'questions.*.question_number' => 'required|integer',
            'questions.*.text' => 'required|string',
            'questions.*.question_image_url' => 'nullable',
            'questions.*.text_explanation' => 'required|string',
            'questions.*.video_explanation_url' => 'nullable|url',
            'questions.*.image_explanation_url' => 'nullable',
            'questions.*.options' => 'nullable|array',
            'questions.*.options.*' => 'nullable|string',
            'questions.*.answer' => 'nullable|array',
            'questions.*.answer.*' => 'nullable|string',
        ]);
    
        foreach($attrs['questions'] as $questionData) {
            $questionImagePath = null;
            $imageExplanationPath = null;
    
            // Handle question image
            if ($questionData['question_image_url'] && is_string($questionData['question_image_url'])) {
                // If it's a base64 encoded string
                $image = $this->saveBase64Image($questionData['question_image_url'], 'question_images');
                $questionImagePath = $image ? Storage::url($image) : null;
            }
    
            // Handle explanation image
            if ($questionData['image_explanation_url'] && is_string($questionData['image_explanation_url'])) {
                // If it's a base64 encoded string
                $image = $this->saveBase64Image($questionData['image_explanation_url'], 'explanation_images');
                $imageExplanationPath = $image ? Storage::url($image) : null;
            }
    
            // Convert arrays to JSON before storing
            $options = isset($questionData['options']) ? json_encode($questionData['options']) : null;
            $answer = isset($questionData['answer']) ? json_encode($questionData['answer']) : null;
    
            $question = QuizQuestion::create([
                'quiz_id' => $request->quiz_id,
                'question_number' => $questionData['question_number'],
                'text' => $questionData['text'],
                'question_image_url' => $questionImagePath,
                'text_explanation' => $questionData['text_explanation'],
                'video_explanation_url' => $questionData['video_explanation_url'] ?? null,
                'image_explanation_url' => $imageExplanationPath,
                'options' => $options,
                'answer' => $answer,
            ]);
        }
    
        return redirect()->route('quizzes.show', $request->quiz_id)
            ->with('success', 'Quiz questions created successfully.');
    }
    
    private function saveBase64Image($base64Image, $folder)
    {
        // Ensure that the base64 string contains the "data:image" part
        $image_parts = explode(";base64,", $base64Image);
    
        if (count($image_parts) !== 2) {
            return null; // Return null if the format is incorrect
        }
    
        $mimeTypePart = explode("image/", $image_parts[0]);
        $image_type = $mimeTypePart[1] ?? 'png'; // Default to 'png' if the type is not found
    
        $image_base64 = base64_decode($image_parts[1]);
        $file = $folder . '/' . uniqid() . '.' . $image_type;
    
        if (Storage::disk('public')->put($file, $image_base64)) {
            return $file;
        }
    
        return null;
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
            'image_explanation_url' => 'nullable',
            'question_image_url' => 'nullable', // 2MB Max
            'text_explanation' => 'required|string',
            'video_explanation_url' => 'nullable|url',
            'options' => 'required|array',
            'options.*' => 'required|string',
            'answer' => 'required|array',
            'answer.*' => 'required|string',
        ]);
    
        // try {
            // Handle file upload if present
            $questionImagePath = $quizQuestion->question_image_url;
            $imageExplanationPath = $quizQuestion->image_explanation_url;
        
            // Handle question image
            if ($request->hasFile('question_image_url')) {
                // File upload handling for question image
                $file = $request->file('question_image_url');
                $path = $file->store('question_images', 'public');
                $questionImagePath = Storage::url($path);
            } elseif ($request->question_image_url && is_string($request->question_image_url)) {
                // Handle base64 image string for question image
                $image = $this->saveBase64Image($request->question_image_url, 'question_images');
                if ($image) {
                    $questionImagePath = Storage::url($image);
                }
            }
        
            // Handle image explanation
            if ($request->hasFile('image_explanation_url')) {
                // File upload handling for image explanation
                $file = $request->file('image_explanation_url');
                $path = $file->store('explanation_images', 'public');
                $imageExplanationPath = Storage::url($path);
            } elseif ($request->image_explanation_url && is_string($request->image_explanation_url)) {
                // Handle base64 image string for image explanation
                $image = $this->saveBase64Image($request->image_explanation_url, 'explanation_images');
                if ($image) {
                    $imageExplanationPath = Storage::url($image);
                }
            }
    
            // Decode JSON strings for options and answer
            $attrs['options'] = json_encode($attrs['options']);
            $attrs['answer'] = json_encode($attrs['answer']);
            $attrs['question_image_url'] = $questionImagePath;
            $attrs['image_explanation_url'] = $imageExplanationPath;
    
            // Update the quiz question
            $quizQuestion->update($attrs);
    
            return redirect()->route('quizzes.show', $request->quiz_id)->with('success', 'Quiz Question Updated Successfully.');
    
        // } catch (\Exception $e) {
        //     Log::error('Quiz Question Update Error:', [
        //         'error' => $e->getMessage(),
        //         'data' => $attrs
        //     ]);
    
        //     return redirect()->back()
        //         ->withErrors(['error' => 'Failed to update quiz question. Please try again.'])
        //         ->withInput();
        // }
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

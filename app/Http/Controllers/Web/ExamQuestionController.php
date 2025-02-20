<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ExamQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ExamQuestionController extends Controller
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

    }

    /**
     * Store a newly created resource in storage.
     */
    
    public function store(Request $request)
    {
   
    
        try {
            $validatedData = $request->validate([
                'exam_type_id' => 'required|exists:exam_types,id',
                'exam_year_id' => 'required|exists:exam_years,id',
                'exam_course_id' => 'required|exists:exam_courses,id',

                'exam_grade_id' => 'nullable',

                'exam_chapter_id' =>  'nullable',

                'questions' => 'required|array|min:1',

                'questions.*.question_text' => 'required|string',
                
                'questions.*.question_image_url' => 'nullable',
                'questions.*.image_explanation_url' => 'nullable',
                
                'questions.*.text_explanation' => 'nullable|string',
                'questions.*.video_explanation_url' => 'nullable|url',
                'questions.*.options' => 'required|array|min:2',
                'questions.*.options.*' => 'required|string',
                'questions.*.answer' => 'required|array|min:1',
                'questions.*.answer.*' => 'required|string',
            ]);
    
            // Log::info('Validated data:', $validatedData);
    
            // $createdQuestions = [];

            // dd($validatedData);
    
            foreach ($validatedData['questions'] as $questionData) {

                $questionImagePath = null;
                $explanationImagePath = null;

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
                    $explanationImagePath = $image ? Storage::url($image) : null;
                }

                $attrs = [
                    'exam_type_id' => $validatedData['exam_type_id'],
                    'exam_year_id' => $validatedData['exam_year_id'],
                    'exam_course_id' => $validatedData['exam_course_id'],
                    'exam_grade_id' => $validatedData['exam_grade_id'] ?? null,
                    'exam_chapter_id' => $validatedData['exam_chapter_id'] ?? null,
                    'question_text' => $questionData['question_text'],
                    'text_explanation' => $questionData['text_explanation'],
                    'question_image_url' => $questionImagePath,
                    'image_explanation_url' => $explanationImagePath,
                    'video_explanation_url' => $questionData['video_explanation_url'] ?? null,
                    'options' => json_encode($questionData['options']),
                    'answer' => json_encode($questionData['answer']),
                ];
    
                Log::info('Creating question with attributes:', $attrs);
    
                $question = ExamQuestion::create($attrs);
                $question->created_by = $request->user()->id;
                $question->updated_by = $request->user()->id;

                $question->save();
                // $createdQuestions[] = $question;
            }
    
            return redirect()->route('exams.index')->with('success', 'Exam questions created successfully');
    
        // } catch (\Illuminate\Validation\ValidationException $e) {
        //     Log::error('Validation error:', $e->errors());
        //     return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating exam questions:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'An error occurred while creating exam questions'. $e->getMessage())->withInput();
        }
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
    public function show(ExamQuestion $examQuestion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExamQuestion $examQuestion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ExamQuestion $examQuestion)
    {
        try {
            $validatedData = $request->validate([
                'exam_type_id' => 'required|exists:exam_types,id',
                'exam_year_id' => 'required|exists:exam_years,id',
                'exam_course_id' => 'required|exists:exam_courses,id',
                'exam_grade_id' => 'required_if:exam_type_id,6th Grade Ministry,8th Grade Ministry,ESSLCE',
                'exists:exam_grades,id',
                'exam_chapter_id' =>  'required_if:exam_type_id,6th Grade Ministry,8th Grade Ministry,ESSLCE|exists:exam_chapters,id',
                'question_text' => 'required|string',
                'image_explanation_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'question_image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'text_explanation' => 'nullable|string',
                'video_explanation_url' => 'nullable|url',
                'options' => 'required|array|min:2',
                'options.*' => 'required|string',
                'answer' => 'required|array|min:1',
                'answer.*' => 'required|string',
                'question_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $questionImagePath = $examQuestion->question_image_url;
            $imageExplanationPath = $examQuestion->image_explanation_url;
    
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

    
            $attrs = [
                'exam_type_id' => $validatedData['exam_type_id'],
                'exam_year_id' => $validatedData['exam_year_id'],
                'exam_course_id' => $validatedData['exam_course_id'],
                'exam_grade_id' => $validatedData['exam_grade_id'] ?? null,
                'exam_chapter_id' => $validatedData['exam_chapter_id'] ?? null,
                'question_text' => $validatedData['question_text'],
                'question_image_url' => $questionImagePath,
                'image_explanation_url' => $imageExplanationPath,
                'text_explanation' => $validatedData['text_explanation'],
                'video_explanation_url' => $validatedData['video_explanation_url'] ?? null,
                'options' => json_encode($validatedData['options']),
                'answer' => json_encode($validatedData['answer']),
                'updated_by' => $request->user()->id,
            ];
    
            // Handle image upload

    
            Log::info('Updating question with attributes:', $attrs);
    
            $examQuestion->update($attrs);
    
            return redirect()->route('exams.index')
                ->with('success', 'Exam question updated successfully');
    
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error:', $e->errors());
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating exam question:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'An error occurred while updating the exam question')->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExamQuestion $examQuestion)
    {
        $examChapter = $examQuestion->examChapter->title;

        $examQuestion->delete();

        return redirect()->route('exams.index')->with('success', 'Exam question of course '.$examChapter.'deleted successfully');
    }
}

<?php

use App\Http\Controllers\Api\v1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\v1\Auth\NewPasswordController;
use App\Http\Controllers\Api\v1\Auth\SessionController;
use App\Http\Controllers\Api\v1\CourseController;
use App\Http\Controllers\Api\v1\HomepageCourseController;
use App\Http\Resources\Api\ChapterContentResource;
use App\Http\Resources\Api\ChapterResource;
use App\Http\Resources\Api\ContentResource;
use App\Http\Resources\Api\CourseChapterResource;
use App\Http\Resources\Api\CourseResource;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Content;
use App\Models\Course;
use App\Models\ExamChapter;
use App\Models\ExamCourse;
use App\Models\ExamGrade;
use App\Models\ExamYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:sanctum', 'verified'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/random-courses-paginate', function(){
     return CourseResource::collection(Course::with(['category','grade','department','batch', 'chapters'])->paginate()); 
});

Route::get('/random-chapters/{id}', function ($id) {
    $chapter = Chapter::with('contents')->findOrFail($id);
    return new ChapterResource($chapter);
});

Route::get('/random-chapters', function(){
   return ChapterResource::collection(
    Chapter::with('contents')->latest()->get()
   );
});

Route::get('/course-chapters/{course_id}', function ($course_id) {

    $chapters = Chapter::where('course_id', $course_id)->get();
    return CourseChapterResource::collection($chapters);
});

Route::get('/chapter-contents/{chapter_id}', function ($chapter_id) {
    // Fetch all contents for the chapter with their relationships
    $contents = Content::where('chapter_id', $chapter_id)
        ->with(['youtubeContents', 'fileContents'])
        ->get();

    // Return the resource collection
    return new ChapterContentResource($contents);
});


Route::get('/random-contents', function(){

    return ContentResource::collection(
        Content::with(['youtubeContents', 'fileContents'])->latest()->get()
    );
 });


 Route::get('/random-contents/{id}', function($id){
    $content = Content::with(['youtubeContents', 'fileContents'])->findOrFail($id);
    return new ContentResource($content);
 });



Route::get('/random-courses', fn() => CourseResource::collection(Course::with(['category', 'grade','department','batch','chapters'])->latest()->get() ));

Route::get('/random-courses/{filterType}', function ($filterType) {
    $categoryMap = [
        "lower_grades" => "lower_grades",
        "high_school" => "higher_grades",
        "university" => "university",
        "random_courses" => "random_courses"
    ];

    if (!array_key_exists($filterType, $categoryMap)) {
        return response()->json(['error' => 'Invalid filter type'], 400);
    }

    $dbCategoryName = $categoryMap[$filterType];

    $category = Category::where('name', $dbCategoryName)->first();

    if (!$category) {
        return response()->json(['error' => 'Category not found'], 404);
    }

    $courses = Course::with(['department', 'grade', 'batch', 'category'])
        ->where('category_id', $category->id)
        ->get();
    return CourseResource::collection($courses);
});

Route::post('/admin-register', [SessionController::class, 'adminRegister']);

Route::post('/student-register', [SessionController::class, 'studentRegister']);

Route::post('/login', [SessionController::class, 'login']);

Route::post('/logout', [SessionController::class, 'logout'])->middleware('auth:sanctum');

Route::delete('/user-delete', [SessionController::class, 'destroy'])->middleware('auth:sanctum');

Route::patch('/user-update', [SessionController::class, 'update'])->middleware('auth:sanctum');


Route::get('/verified-middleware', function () {
    return response()->json([
        'message' => 'The email account is already confirmed now you are able to see this message...',
    ], 201);
})->middleware('auth:sanctum');


Route::post('email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail'])->middleware('auth:sanctum');

Route::post('verify-email/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify')->middleware('auth:sanctum');

Route::post('forgot-password', [NewPasswordController::class, 'forgotPassword']);

Route::post('reset-password', [NewPasswordController::class, 'reset']);


Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('homepage/courses', HomepageCourseController::class);
    Route::resource('courses', CourseController::class);
});

Route::get('/exam-chapters/{gradeId}', fn($gradeId) => ExamChapter::where('exam_grade_id', $gradeId)->get());

Route::get('/exam-years/{examTypeId}', function($examTypeId){
    return ExamYear::where('exam_type_id', $examTypeId)->get();
});

Route::get('/exam-courses/{examYearId}', fn($examYearId)=>ExamCourse::where('exam_year_id', $examYearId)->get());

Route::get('/exam-grades/{examCourseId}', fn($examCourseId)=>ExamGrade::where('exam_course_id', $examCourseId)->get());
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
use App\Models\Chapter;
use App\Models\Content;
use App\Models\Course;
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
    // Fetch all chapters for the course
    $chapters = Chapter::where('course_id', $course_id)->get();

    // Return the chapters transformed by the resource
    return CourseChapterResource::collection($chapters);
});

Route::get('/chapter-contents/{chapter_id}', function ($chapter_id) {
    // Fetch all contents for the chapter with their relationships
    $contents = Content::where('chapter_id', $chapter_id)
        ->with(['youtubeContents', 'fileContents'])
        ->get();

    // Return the transformed response
    return ChapterContentResource::collection($contents);
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


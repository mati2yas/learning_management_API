<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\ChapterController;
use App\Http\Controllers\Web\ContentController;
use App\Http\Controllers\Web\CourseController;
use App\Http\Controllers\Web\ExamController;
use App\Http\Controllers\Web\ExamQuestionController;
use App\Http\Controllers\Web\ExamTypeController;
use App\Http\Controllers\Web\FileContentController;
use App\Http\Controllers\Web\QuizController;
use App\Http\Controllers\Web\QuizQuesitonController;
use App\Http\Controllers\Web\UserManagementController;
use App\Http\Controllers\Web\YoutubeContentController;
use App\Models\Course;
use App\Models\QuizQuestion;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->resource('courses', CourseController::class);

Route::middleware(['auth', 'verified'])->resource('chapters', ChapterController::class);

Route::middleware(['auth', 'verified'])->resource('contents', ContentController::class);

Route::middleware(['auth', 'verified'])->resource('quizzes', QuizController::class);

Route::middleware(['auth', 'verified'])->resource('youtube-contents', YoutubeContentController::class);

Route::middleware(['auth', 'verified'])->resource('file-contents', FileContentController::class);

Route::middleware(['auth', 'verified'])->resource('quiz-questions', QuizQuesitonController::class);

Route::middleware(['auth', 'verified'])->resource('user-management', UserManagementController::class);

Route::middleware(['auth', 'verified'])->resource('exams', ExamController::class);

Route::middleware(['auth', 'verified'])->resource('exam-questions', ExamQuestionController::class);

Route::middleware(['auth', 'verified'])->resource('user-managements', UserManagementController::class);

Route::get('/random', fn() => Course::paginate(10));


require __DIR__.'/auth.php';

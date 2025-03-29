<?php

use App\Http\Controllers\ExamCourseController;
use App\Http\Controllers\ExamNewController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\BankController;
use App\Http\Controllers\Web\CarouselContentController;
use App\Http\Controllers\Web\ChapterController;
use App\Http\Controllers\Web\ContentController;
use App\Http\Controllers\Web\CourseController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\ExamController;
use App\Http\Controllers\Web\ExamDetailController;
use App\Http\Controllers\Web\ExamQuestionController;
use App\Http\Controllers\Web\FileContentController;
use App\Http\Controllers\Web\QuizController;
use App\Http\Controllers\Web\QuizQuesitonController;
use App\Http\Controllers\Web\StudentManagementController;
use App\Http\Controllers\Web\SubscriptionController;
use App\Http\Controllers\Web\UserManagementController;
use App\Http\Controllers\Web\YoutubeContentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', DashboardController::class)
        ->middleware(['permission:can view dashboard'])
        ->name('dashboard');

    Route::resource('courses', CourseController::class)
        ->middleware(['permission:can view courses']);

    Route::resource('exams', ExamController::class)
        ->middleware(['permission:can view exams']);

    Route::resource('exams-new', ExamNewController::class)
        ->middleware(['permission:can view exams']);

    Route::resource('user-managements', UserManagementController::class)
        ->middleware(['permission:can view workers management']);

    Route::resource('student-managements', StudentManagementController::class)
        ->middleware(['permission:can view students management']);

    Route::post('student-managements/ban', [StudentManagementController::class, 'ban'])
        ->middleware(['permission:can ban'])
        ->name('student-managements.ban');

    Route::post('student-managements/unban', [StudentManagementController::class, 'unBan'])
        ->middleware(['permission:can unban'])
        ->name('student-managements.unban');

    Route::resource('subscriptions', SubscriptionController::class)
        ->middleware(['permission:can view subscription']);

    Route::post('/subscription-rejection/{subscriptionId}', [SubscriptionController::class, 'rejection'])
        ->middleware(['permission:can view subscription'])
        ->name('subscriptions.reject');

    Route::post('/subscription-approve/{subscriptionId}', [SubscriptionController::class, 'approve'])
        ->middleware(['permission:can view subscription'])
        ->name('subscriptions.approve');

    Route::resource('exam-questions', ExamQuestionController::class);

    Route::resource('chapters', ChapterController::class);

    Route::resource('contents', ContentController::class);

    Route::resource('youtube-contents', YoutubeContentController::class);

    Route::resource('file-contents', FileContentController::class);

    Route::resource('quizzes', QuizController::class);

    Route::resource('quiz-questions', QuizQuesitonController::class);

    Route::resource('exam-courses', ExamCourseController::class)
        ->middleware(['permission:can view exam courses']);

    Route::resource('carousel-contents', CarouselContentController::class);
    Route::resource('exam-details', ExamDetailController::class);
    Route::resource('/banks', BankController::class);
});


Route::get('/random', fn() => Inertia::render('Exam-Detail/Index'));


require __DIR__.'/auth.php';

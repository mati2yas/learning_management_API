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

Route::middleware(['auth','verified'])->group(function () {

    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::resource('courses', CourseController::class);
    
    Route::resource('chapters', ChapterController::class);

    Route::resource('contents', ContentController::class);

    Route::resource('quizzes', QuizController::class);

    Route::resource('youtube-contents', YoutubeContentController::class);

    Route::resource('file-contents', FileContentController::class);

    Route::resource('quiz-questions', QuizQuesitonController::class);

    Route::resource('exams', ExamController::class);

    Route::resource('exams-new', ExamNewController::class);

    Route::resource('exam-questions', ExamQuestionController::class);

    Route::resource('user-managements', UserManagementController::class);

    Route::resource('student-managements', StudentManagementController::class);

    Route::post('student-managements/ban',[StudentManagementController::class, 'ban'])->name('student-managements.ban');

    Route::post('student-managements/unban',[StudentManagementController::class, 'unBan'])->name('student-managements.unban');

    Route::resource('subscriptions', SubscriptionController::class);

    Route::resource('exam-courses', ExamCourseController::class);

    Route::resource('carousel-contents', CarouselContentController::class);

    Route::resource('exam-details', ExamDetailController::class );

    

    Route::post('/subscription-rejection/{subscriptionId}', [SubscriptionController::class, 'rejection'])->name('subscriptions.reject');

    Route::post('/subscription-approve/{subscriptionId}', [SubscriptionController::class, 'approve'])->name('subscriptions.approve');

    Route::resource('/banks', BankController::class);
});


Route::get('/random', fn() => Inertia::render('Exam-Detail/Index'));


require __DIR__.'/auth.php';

<?php

use App\Http\Controllers\ExamCourseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\ChapterController;
use App\Http\Controllers\Web\ContentController;
use App\Http\Controllers\Web\CourseController;
use App\Http\Controllers\Web\ExamController;
use App\Http\Controllers\Web\ExamQuestionController;
use App\Http\Controllers\Web\FileContentController;
use App\Http\Controllers\Web\QuizController;
use App\Http\Controllers\Web\QuizQuesitonController;
use App\Http\Controllers\Web\StudentManagementController;
use App\Http\Controllers\Web\SubscriptionController;
use App\Http\Controllers\Web\UserManagementController;
use App\Http\Controllers\Web\YoutubeContentController;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\ExamQuestion;
use App\Models\SubscriptionRequest;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
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

    $categories = [
        3 => ['label' => 'chrome', 'color' => 'var(--color-chrome)'],
        1 => ['label' => 'safari', 'color' => 'var(--color-safari)'],
        2 => ['label' => 'firefox', 'color' => 'var(--color-firefox)'],
        4 => ['label' => 'edge', 'color' => 'var(--color-edge)'],
    ];

    $courseData = collect($categories)->map(function ($details, $categoryId) {
        return [
            'browser' => $details['label'],
            'visitors' => Course::where('category_id', $categoryId)->count(),
            'fill' => $details['color'],
        ];
    })->values()->all();

    return Inertia::render('Dashboard',[
        'courseData' => $courseData,
        'chapters' => Chapter::count(),
        'examQuestions' => ExamQuestion::count(),
        'users' => User::role('student')->count(),
        'pendingSubscriptions' => SubscriptionRequest::where('status', 'Pending')->count(),
        'canAdd' => Auth::user()->hasDirectPermission('add courses'),
    ]);

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

// Route::middleware(['auth', 'verified'])->resource('user-management', UserManagementController::class);

Route::middleware(['auth', 'verified'])->resource('exams', ExamController::class);

Route::middleware(['auth', 'verified'])->resource('exam-questions', ExamQuestionController::class);


    Route::middleware(['auth', 'verified'])->resource('user-managements', UserManagementController::class);


Route::middleware(['auth', 'verified'])->resource('student-managements', StudentManagementController::class);

Route::middleware(['auth', 'verified'])->post('student-managements/ban',[StudentManagementController::class, 'ban'])->name('student-managements.ban');

Route::middleware(['auth', 'verified'])->post('student-managements/unban',[StudentManagementController::class, 'unBan'])->name('student-managements.unban');


Route::middleware(['auth', 'verified'])->resource('subscriptions', SubscriptionController::class);

Route::middleware(['auth', 'verified'])->resource('exam-courses', ExamCourseController::class);

Route::middleware(['auth', 'verified'])->post('/subscription-rejection/{subscriptionId}', [SubscriptionController::class, 'rejection'])->name('subscriptions.reject');

Route::middleware(['auth', 'verified'])->post('/subscription-approve/{subscriptionId}', [SubscriptionController::class, 'approve'])->name('subscriptions.approve');

Route::get('/random', fn() => Course::paginate(10));




require __DIR__.'/auth.php';

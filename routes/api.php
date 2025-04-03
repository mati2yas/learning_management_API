<?php

use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\CarouselContentController;
use App\Http\Controllers\Api\v1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\v1\Auth\NewPasswordController;
use App\Http\Controllers\Api\v1\Auth\SessionController;
use App\Http\Controllers\Api\v1\CourseController;
use App\Http\Controllers\Api\v1\HomepageCourseController;
use App\Http\Controllers\Api\v1\NotificationController;
use App\Http\Resources\Api\ChapterContentResource;
use App\Http\Resources\Api\ChapterResource;
use App\Http\Resources\Api\ContentResource;
use App\Http\Resources\Api\CourseChapterResource;
use App\Http\Resources\Api\CourseResource;
use App\Http\Resources\Api\ExamCourseTypeResource;
use App\Http\Resources\Api\QuizResource;
use App\Http\Resources\Api\ExamGradeResource;
use App\Http\Resources\Api\ExamQuestionChapterResource;
use App\Http\Resources\ExamYearResource;
use App\Models\Bank;
use App\Models\Batch;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Content;
use App\Models\Course;
use App\Models\Department;
use App\Models\Exam;
use App\Models\ExamChapter;
use App\Models\ExamCourse;
use App\Models\ExamGrade;
use App\Models\ExamQuestion;
use App\Models\ExamType;
use App\Models\ExamYear;
use App\Models\Grade;
use App\Models\Like;
use App\Models\PaidExam;
use App\Models\Quiz;
use App\Models\Save;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'verified'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/random-courses-paginate', function(){
     return CourseResource::collection(Course::with(['category','grade','department','batch', 'chapters','subscriptionRequests'])->paginate()); 
});

Route::get('/random-chapters/{id}', function ($id) {
    $chapter = Chapter::with('contents','subscriptionRequests')->findOrFail($id);
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

Route::get('/quizzes/{quiz_id}', function ($quiz_id) {
    $quiz = Quiz::with('quizQuestions')->findOrFail($quiz_id);
    return new QuizResource($quiz);
});


Route::get('/chapter-contents/{chapter_id}', function ($chapter_id) {
    // Fetch the chapter with its related contents, videos, documents, and quizzes
    $chapter = Chapter::with([
        'contents.youtubeContents',
        'contents.fileContents',
        'quizzes.quizQuestions'
    ])->findOrFail($chapter_id);

    // Return the resource
    return new ChapterContentResource($chapter);
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



 Route::get('/random-courses', fn() => 
 CourseResource::collection(
     Course::with(['category', 'grade', 'department', 'batch', 'chapters', 'subscriptionRequests'])
         ->latest()
         ->take(20)
         ->get()
 )
);

Route::post('/delete-user/{id}', function ($id) {
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->delete();
    return response()->json(['message' => 'User deleted successfully'], 200);
})->middleware('auth:sanctum');


Route::post('/admin-register', [SessionController::class, 'adminRegister']);

Route::post('/student-register', [SessionController::class, 'studentRegister']);

Route::post('/login', [SessionController::class, 'login']);

Route::post('/logout', [SessionController::class, 'logout'])->middleware('auth:sanctum');

Route::delete('/user-delete', [SessionController::class, 'destroy'])->middleware('auth:sanctum');


Route::post('/user-update', [SessionController::class, 'update'])->middleware('auth:sanctum');

Route::post('email/verification-notification', [EmailVerificationController::class, 'sendVerificationEmail'])->middleware('auth:sanctum');


Route::resource('carousel-contents-api', CarouselContentController::class);


Route::post('forgot-password', [NewPasswordController::class, 'forgotPassword']);

Route::post('reset-password', [NewPasswordController::class, 'reset']);

Route::group(['middleware' => 'auth:sanctum'], function () {

    Route::get('/random-courses/{filterType}', function (Request $request, $filterType) {
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
    
        $userId = $request->user()->id;
    
        $courses = Course::with(['department', 'grade', 'batch', 'category', 'chapters','subscriptionRequests'])
            ->where('category_id', $category->id)
            ->whereDoesntHave('subscriptionRequests', function ($query) use ($userId) {
                $query->where('user_id', $userId)
                      ->whereIn('status', ['Pending', 'Approved']);
            }) // Exclude courses with "Pending" or "Approved" subscriptions for the user
            ->get();
    
        return CourseResource::collection($courses);
    });

    Route::get('/course-search', function (Request $request) {
        $query = Course::with(['category', 'department', 'grade', 'chapters', 'batch','subscriptionRequests']);
    
        if ($request->query('course_name')) {
            $query->where('course_name', 'like', '%' . $request->query('course_name') . '%');
        }
    
        return CourseResource::collection($query->get());
    });



    Route::get('/notifications-new', [NotificationController::class, 'index']); // Fetch all notifications
    Route::post('/notifications-new/{id}/read', [NotificationController::class, 'markAsRead']); // Mark as read
    Route::post('/notifications-new/read-all', [NotificationController::class, 'markAllAsRead']); // Mark all as read


    Route::get('/notifications/unread', function (Request $request) {
        return response()->json([
            'unread_notifications' => $request->user()->unreadNotifications
        ]);
    });

    Route::post('/notifications/{id}/read', function ($id, Request $request) {
        $notification = $request->user()->notifications()->where('id', $id)->first();
    
        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notification marked as read']);
        }
    
        return response()->json(['error' => 'Notification not found'], 404);
    });

    Route::post('/notifications/read-all', function (Request $request) {

        $request->user()->unreadNotifications->markAsRead();
    
        return response()->json(['message' => 'All notifications marked as read']);
    });

    Route::get('/notifications', function (Request $request) {
        return response()->json([
            'notifications' => $request->user()->notifications
        ]);
    });

    Route::post('toggle-save/{course_id}', function (string $course_id, Request $request) {

        $user = $request->user();
        $course = Course::with(['category', 'department', 'grade', 'chapters', 'batch'])
                ->findOrFail($course_id);

    
        // Check if the course is already saved
        $save = Save::where('user_id', $user->id)->where('course_id', $course->id)->first();
    
        if ($save) {
            $save->delete(); // Unsave
            return response()->json(['message' => 'Course unsaved successfully.']);
        } else {
            Save::create(['user_id' => $user->id, 'course_id' => $course->id]); // Save
            return response()->json(['message' => 'Course saved successfully.']);
        }
    });
    
    Route::post('toggle-like/{course_id}', function (string $course_id, Request $request) {
        $user = $request->user();
        $course = Course::with(['category', 'department', 'grade', 'chapters', 'batch'])
                ->findOrFail($course_id);

    
        // Check if the course is already liked
        $like = Like::where('user_id', $user->id)->where('course_id', $course->id)->first();
    
        if ($like) {
            $like->delete(); // Unlike
            return response()->json(['message' => 'Course unliked successfully.']);
        } else {
            Like::create(['user_id' => $user->id, 'course_id' => $course->id]); // Like
            return response()->json(['message' => 'Course liked successfully.']);
        }
    });

    Route::get('/saved-courses', function (Request $request) {
        $user = $request->user(); // Get the authenticated user
    
        // Fetch saved courses for the user with course details
        $savedCourses = Course::with(['category', 'department', 'grade', 'chapters', 'batch','subscriptionRequests'])
        ->whereIn('id', function ($query) use ($user) {
            $query->select('course_id')->from('saves')->where('user_id', $user->id);
        })->get();

    
        return CourseResource::collection(
             $savedCourses
        );
    });

    Route::get('/paid-exams', function(Request $request){
        $user = $request->user(); // Get authenticated user

        $user->subscriptionRequests()
        ->whereHas('subscriptions', function ($query) {
            $query->where('subscription_end_date', '<', Carbon::today())
                  ->where('status', 'active');
        })
        ->with([
            'subscriptions.subscriptionRequest.courses', // Assuming `courses` is the correct relation name
            'subscriptions.subscriptionRequest.exams.examCourse',
        ])
        ->get()
        ->pluck('subscriptions')
        ->flatten()
        ->each(function ($subscription) use ($user) {
            // Update subscription status to expired
            $subscription->update(['status' => 'expired']);
        
            // Get the subscriptionRequest and iterate over courses and exams
            $subscriptionRequest = $subscription->subscriptionRequest;
            
            // Handle courses
            $courseNames = $subscriptionRequest->courses->pluck('name')->toArray();
            
            // Handle exams
            $examNames = $subscriptionRequest->exams->pluck('examCourse.course_name')->toArray();
            
            // Determine the appropriate message
            $subscriptionType = '';
            
            if (count($courseNames) > 0) {
                $subscriptionType .= "Courses: " . implode(', ', $courseNames);
            }
            
            if (count($examNames) > 0) {
                if ($subscriptionType) {
                    $subscriptionType .= " | ";
                }
                $subscriptionType .= "Exams: " . implode(', ', $examNames);
            }
            
            if (empty($subscriptionType)) {
                $subscriptionType = "your subscription";
            }
        
            // Send notification
            $user->APINotifications()->create([
                'type' => 'subscription',
                'message' => "Your subscription for {$subscriptionType} has expired.",
            ]);
        });   

        $paidExams = PaidExam::where('user_id', $user->id)
        ->with([
            'exam.examCourse',
            'exam.examType',
            'exam.examYear',
            'exam.subscriptionRequests' => function ($query) use ($user) {
                // Filter to only get approved subscription requests
                $query->where('user_id', $user->id)
                        ->where('status', 'Approved')  // Only Approved subscriptions
                        ->with('subscriptions');
            }
        ])
        ->get()
        ->map(function ($paidExam) use ($user) {
            $exam = $paidExam->exam;

            // Get the user's approved subscription related to this exam
            $subscription = optional($exam->subscriptionRequests->first()->subscriptions->first());

            return [
                'exam_sheet_id' => $exam->id,
                'course_id' => $exam->exam_course_id,
                'course' => $exam->examCourse->name ?? "chemistry",
                'exam_type' => $exam->examType->name,
                'exam_year' => $exam->examYear->year,
                'exam_year_id' => $exam->exam_year_id,
                'exam_duration' => $exam->exam_duration ?? 60,
                'subscription_status' => $subscription->status ?? 'inactive', // Correctly fetch approved status
            ];
        });
    
        return response()->json([
            'status' => 'success',
            'data' => $paidExams,
        ]);
    });

    Route::get('/paid-courses', function (Request $request) {
        $user = $request->user(); // Get authenticated user

        $user->subscriptionRequests()
        ->whereHas('subscriptions', function ($query) {
            $query->where('subscription_end_date', '<', Carbon::today())
                  ->where('status', 'active');
        })
        ->with([
            'subscriptions.subscriptionRequest.courses', // Assuming `courses` is the correct relation name
            'subscriptions.subscriptionRequest.exams.examCourse',
        ])
        ->get()
        ->pluck('subscriptions')
        ->flatten()
        ->each(function ($subscription) use ($user) {
            // Update subscription status to expired
            $subscription->update(['status' => 'expired']);
        
            // Get the subscriptionRequest and iterate over courses and exams
            $subscriptionRequest = $subscription->subscriptionRequest;
            
            // Handle courses
            $courseNames = $subscriptionRequest->courses->pluck('name')->toArray();
            
            // Handle exams
            $examNames = $subscriptionRequest->exams->pluck('examCourse.course_name')->toArray();
            
            // Determine the appropriate message
            $subscriptionType = '';
            
            if (count($courseNames) > 0) {
                $subscriptionType .= "Courses: " . implode(', ', $courseNames);
            }
            
            if (count($examNames) > 0) {
                if ($subscriptionType) {
                    $subscriptionType .= " | ";
                }
                $subscriptionType .= "Exams: " . implode(', ', $examNames);
            }
            
            if (empty($subscriptionType)) {
                $subscriptionType = "your subscription";
            }
        
            // Send notification
            $user->APINotifications()->create([
                'type' => 'subscription',
                'message' => "Your subscription for {$subscriptionType} has expired.",
            ]);
        });
    
    
        // Fetch paid courses for the user with course details
        $paidCourses = Course::with(['category', 'department', 'grade', 'chapters', 'batch', 'subscriptionRequests'=> function ($query) use ($user) {
            // Filter to only get approved subscription requests
            $query->where('user_id', $user->id)
                  ->where('status', 'Approved')  // Only Approved subscriptions
                  ->with('subscriptions');
        }])
        ->whereIn('id', function ($query) use ($user) {
            $query->select('course_id')
                  ->from('paid_courses')
                  ->where('user_id', $user->id);
        })
        ->get();
    
    
        return CourseResource::collection($paidCourses);
    });

    Route::get('homepage/courses', HomepageCourseController::class);
    Route::resource('courses', CourseController::class);

    Route::get('exams/exam-questions-chapter/{exam_grade_id}/{chapter_id}', function($exam_grade_id, $chapter_id){

        $questions = ExamQuestion::where('exam_chapter_id', $chapter_id)->where('exam_grade_id', $exam_grade_id)
        ->with([ 'examChapter.examCourse'])
        ->get();
    
        return ExamQuestionChapterResource::collection($questions);
    });


    Route::get('exams/exam-questions-year/{exam_year_id}', function($exam_year_id){
        $questions = ExamQuestion::where('exam_year_id', $exam_year_id)
        ->get();
    
        return ExamQuestionChapterResource::collection($questions);
    });


    Route::post('subscription-request', [SubscriptionController::class, 'store']);


    Route::get('exams/exam-years/{examTypeName}', function($examTypeName){

        $types = ['matric','ministry', 'ngat','exit'];
    
        $examTypeRecord = ExamType::where('name',$examTypeName)->first();
    
        if (!$examTypeRecord) {
            return response()->json(['error' => 'Invalid exam type'], 404);
        }
    
        // Fetch exam years with question counts using Eloquent
        $examYears = ExamQuestion::with('examYear')
            ->select('exam_year_id')
            ->where('exam_type_id', $examTypeRecord->id)
            ->groupBy('exam_year_id')
            ->selectRaw('exam_year_id, COUNT(id) as question_count')
            ->get();
    
        // Return the data as a resource collection
        return ExamYearResource::collection($examYears);
    
    });
    

    
    Route::get('exams/exam-courses/{examType}', function($examType) {
        $examType = ExamType::with('exams.paidExams')->where('name', $examType)->first();
    
        if (!$examType) {
            return response()->json(['message' => 'Exam type not found'], 404);
        }
    
        // Fetch distinct courses related to this exam type
        $examCourses = Exam::where('exam_type_id', $examType->id)
            ->with('examQuestions.examYear', 'examCourse','examYear')
            ->get()
            ->groupBy('examCourse.id');  // Group exams by `examCourse`
    
        return ExamCourseTypeResource::collection($examCourses);
    });
    

    Route::get('exams/exam-questions-year/{exam_course_id}/{exam_year_id}', function ($exam_course_id, $exam_year_id) {

        $questions = ExamQuestion::where('exam_year_id', $exam_year_id)->where('exam_course_id', $exam_course_id)
            ->with(['examChapter.examCourse'])
            ->get();

        return ExamQuestionChapterResource::collection($questions);
    });
});


Route::get('/bank-accounts', fn() => Bank::all());


Route::get('exams/exam-grades/{exam_course_id}/{exam_year_id}', function($exam_course_id,$exam_year_id) {


    $examGrades = ExamQuestion::where('exam_course_id', $exam_course_id)->where('exam_year_id', $exam_year_id)
                    ->with('examGrade.examCourses.examChapters','examGrade.examCourses.examChapters.examQuestions')  // 
                    ->get()
                    ->pluck('examGrade') 
                    ->unique()->filter();   
                    
    return ExamGradeResource::collection(resource: $examGrades);
});


Route::get('/exam-chapters/{gradeId}', fn($gradeId) => ExamChapter::where('exam_course_id', $gradeId)->get());

Route::get('/exam-years/{examTypeId}', function($examTypeId){
    return ExamYear::where('exam_type_id', $examTypeId)->get();
});

Route::get('/exam-courses/{examYearId}', fn($examYearId)=>ExamCourse::where('exam_type_id', $examYearId)->get());

Route::get('/exam-courses-create/{examTypeId}/{examGradeId}', fn($examTypeId, $examGradeId)=>ExamCourse::where('exam_type_id', $examTypeId)->where('exam_grade_id', $examGradeId)->get());

Route::get('/exam-grades/{examCourseId}', fn($examCourseId)=>ExamGrade::where('exam_course_id', $examCourseId)->get());


Route::get('/users-web/{userId}', function($userId){
    $user = App\Models\User::find($userId);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }
     return response()->json(['name' => $user->name]);
});

Route::get('/categories', function(){
    return Category::all();
});

Route::get('/grades', function(Request $request){
    // dd($request->all()) ;
    Log::info($request->all());
    return Grade::where('category_id', $request->category_id)->get();
});

Route::get('/departments', function(Request $request){
    return Department::where('category_id', $request->category_id)->get();
});

Route::get('/batches', function(Request $request){
    return Batch::where('department_id', $request->department_id)->get();
});

// Route::get('/exam-chapters/{id}', fn()=>ExamChapter::find($id));

// Route::get('/exam-courses/{id}', fn()=>ExamCourse::find($id));



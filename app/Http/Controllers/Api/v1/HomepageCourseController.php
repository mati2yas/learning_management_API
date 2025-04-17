<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Resources\Api\HomepageCourseResource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\PaidCourse;
use App\Models\PaidExam;
use Carbon\Carbon;

class HomepageCourseController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        $user = $request->user();

        $user->subscriptionRequests()
        ->whereHas('subscriptions', function ($query) {
            $query->where('subscription_end_date', '<', Carbon::today())
                ->where('status', 'active');
        })
        ->with([
            'subscriptions.subscriptionRequest.courses',
            'subscriptions.subscriptionRequest.exams.examCourse',
        ])
        ->get()
        ->pluck('subscriptions')
        ->flatten()
        ->each(function ($subscription) use ($user) {
            // 1. Expire the subscription
            $subscription->update(['status' => 'expired']);

            // 2. Get subscriptionRequest
            $subscriptionRequest = $subscription->subscriptionRequest;

            // 3. Get course IDs and exam IDs
            $courseIds = $subscriptionRequest->courses->pluck('id')->toArray();
            $examIds = $subscriptionRequest->exams->pluck('id')->toArray();

            // 4. Mark PaidCourse and PaidExam as expired instead of deleting
            if (!empty($courseIds)) {
                PaidCourse::where('user_id', $user->id)
                    ->whereIn('course_id', $courseIds)
                    ->update(['expired' => true]);
            }

            if (!empty($examIds)) {
                PaidExam::where('user_id', $user->id)
                    ->whereIn('exam_id', $examIds)
                    ->update(['expired' => true]);
            }

            // 5. Create human-readable message
            $courseNames = $subscriptionRequest->courses->pluck('course_name')->toArray();
            $examNames = $subscriptionRequest->exams->pluck('examCourse.course_name')->toArray();

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

            // 6. Notify the user
            $user->APINotifications()->create([
                'type' => 'subscription',
                'message' => "Your subscription for {$subscriptionType} has expired.",
            ]);
        });
        
        
        $userId = $request->user()->id;
        $categories = ['lower_grades', 'higher_grades', 'university', 'random_courses'];
    
        $courses = collect();
    
        foreach ($categories as $category) {
            $categoryCourses = Course::query()
                ->whereHas('category', function ($query) use ($category) {
                    $query->where('name', $category);
                })
                // ->whereDoesntHave('subscriptionRequests', function ($query) use ($userId) {
                //     $query->where('user_id', $userId)
                //           ->whereIn('status', ['Pending', 'Approved']);
                // }) // Exclude courses with 'Pending' or 'Approved' subscriptions for the user
                ->with(['category', 'department', 'grade', 'chapters', 'batch', 'subscriptionRequests'=> function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                          ->where('status', 'Approved')
                          ->with('subscriptions');
                }])
                // Eager load relationships
                ->withCount(['likes', 'saves'])
                ->leftJoin('paid_courses', function ($join) use ($userId) {
                    $join->on('courses.id', '=', 'paid_courses.course_id')
                        ->where('paid_courses.user_id', $userId);
                })
                ->whereNull('paid_courses.id') // Exclude bought courses
                ->orderByRaw('(likes_count + saves_count) DESC')
                ->limit(10) // Fetch top 10
                ->get()
                ->shuffle() // Shuffle to get random 3
                ->take(3);
    
            $courses = $courses->merge($categoryCourses);
        }

        // return response('<h1>Hello, this is an HTML response</h1>', 200)
        //  ->header('Content-Type', 'text/html');

        // return "biruk";

    
        return HomepageCourseResource::collection($courses);
    }    
    
}

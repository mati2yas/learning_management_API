<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Resources\Api\HomepageCourseResource;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Course;

class HomepageCourseController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $userId = $request->user()->id;
        $categories = ['lower_grades', 'higher_grades', 'university', 'random_courses'];
    
        $courses = collect();
    
        foreach ($categories as $category) {
            $categoryCourses = Course::query()
                ->whereHas('category', function ($query) use ($category) {
                    $query->where('name', $category);
                })
                ->whereDoesntHave('subscriptionRequests', function ($query) use ($userId) {
                    $query->where('user_id', $userId)
                          ->whereIn('status', ['Pending', 'Approved']);
                }) // Exclude courses with 'Pending' or 'Approved' subscriptions for the user
                ->with(['batch', 'grade', 'department', 'category', 'chapters']) // Eager load relationships
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

        return response('<h1>Hello, this is an HTML response</h1>', 200)
         ->header('Content-Type', 'text/html');

    
        // return HomepageCourseResource::collection($courses);
    }    
    
}

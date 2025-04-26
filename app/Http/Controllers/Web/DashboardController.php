<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Models\CarouselContent;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\ExamQuestion;
use App\Models\SubscriptionRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Fetch categories dynamically by name
        $categories = Category::whereIn('name', ['lower_grades', 'higher_grades', 'university', 'random_courses'])
            ->pluck('id', 'name');
    
        // Define colors for categories
        $categoryColors = [
            'lower_grades' => 'var(--color-chrome)',
            'higher_grades' => 'var(--color-safari)',
            'university' => 'var(--color-firefox)',
            'random_courses' => 'var(--color-edge)',
        ];
    
        // Prepare course data dynamically
        $courseData = collect($categories)->map(function ($categoryId, $categoryName) use ($categoryColors) {
    
            if (strtolower($categoryName) === 'random_courses') {
                $formattedCategoryName = 'Other Courses';
            } else {
                // For other category names like "lower_grades"
                $formattedCategoryName = ucwords(str_replace('_', ' ', $categoryName));
            }
    
            return [
                'browser' => $formattedCategoryName,
                'visitors' => Course::where('category_id', $categoryId)->count(),
                'fill' => $categoryColors[$categoryName] ?? 'var(--color-default)',
            ];
        })->values()->all();
    
        // Get the authenticated user
        $user = Auth::user();
    
        // Check if the user has permission to view the dashboard
        if ($user->hasPermissionTo('can view dashboard')) {
            // Proceed with rendering the dashboard view if the user has permission
            return Inertia::render('Dashboard', [
                'courseData' => $courseData,
                'chapters' => Chapter::count(),
                'examQuestions' => ExamQuestion::count(),
                'users' => User::role('student')->count(),
                'carouselContents' => CarouselContent::all(),
                'banks' => Bank::all(),
                'pendingSubscriptions' => SubscriptionRequest::where('status', 'Pending')->count(),
                'canAdd' => $user->hasDirectPermission('add courses'),
            ]);
        }
    
        // Define the priority order of redirections based on permissions
        $redirectRoutes = [
            'can view subscription' => route('subscriptions.index'),
            'can view courses' => route('courses.index'),
            'can view exams' => route('exams-new.index'),
            'can view exam courses' => route('exam-courses.index'),
            'can view students management' => route('student-managements.index'),
            'can view workers management' => route('user-managements.index'),
        ];
    
        // Loop through permissions and redirect to the first matching route
        foreach ($redirectRoutes as $permission => $route) {
            if ($user->hasPermissionTo($permission)) {
                return redirect($route);
            }
        }
    
        // Default fallback if the user has no permissions
        return redirect()->route('login')->with('error', 'You do not have access to any sections.');
    }
    
    
}

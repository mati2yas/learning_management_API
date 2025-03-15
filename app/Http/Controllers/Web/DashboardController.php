<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
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
            return [
                'browser' => $categoryName,
                'visitors' => Course::where('category_id', $categoryId)->count(),
                'fill' => $categoryColors[$categoryName] ?? 'var(--color-default)',
            ];
        })->values()->all();

        return Inertia::render('Dashboard', [
            'courseData' => $courseData,
            'chapters' => Chapter::count(),
            'examQuestions' => ExamQuestion::count(),
            'users' => User::role('student')->count(),
            'carouselContents' => CarouselContent::all(),
            'pendingSubscriptions' => SubscriptionRequest::where('status', 'Pending')->count(),
            'canAdd' => Auth::user()->hasDirectPermission('add courses'),
        ]);
    }
}

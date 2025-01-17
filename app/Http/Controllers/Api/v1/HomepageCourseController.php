<?php

namespace App\Http\Controllers\Api\v1;

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
        return Course::query()
            ->withCount(['likes', 'saves']) // Dynamically calculate the counts
            ->orderByRaw('(`likes_count` + `saves_count`) DESC') // Order by total interactions
            ->limit(10) // Fetch the top 10 courses
            ->get();
    }
    
}

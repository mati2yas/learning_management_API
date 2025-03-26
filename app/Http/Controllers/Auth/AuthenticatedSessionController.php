<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();
    
        // Get the authenticated user
        $user = Auth::user();
    
        // Define the priority order of redirections based on permissions
        $redirectRoutes = [
            'can view dashboard' => route('dashboard'),
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
                return redirect()->intended($route);
            }
        }
    
        // Default fallback if the user has no permissions
        return redirect()->route('login')->with('error', 'You do not have access to any sections.');
    }
    

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}

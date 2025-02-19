<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\Web\StudentManagementIndexResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentManagementController extends Controller
{
    public function index(){

        $sortField = request('sort_field','created_at');
        $sortDirection = request('sort_direction', 'desc');

        $query = User::whereHas('roles', function($query) {
            $query->where('name', 'student')->where('guard_name', 'api');
        });

        if(request('name')) {
            $query->where('name','like','%'. request('name') .'%');
        }

        $users = $query->orderBy($sortField, $sortDirection)->with(['subscriptionRequests.subscriptions','subscriptionRequests.courses'])->with('bannedUser')->paginate(10);

        return Inertia::render("Student-Management/Index", [
            'users' => StudentManagementIndexResource::collection( $users ),
            'queryParams' => request()->query() ?: null,
            'session' => session('success'),
            'canBan' => Auth::user()->hasDirectPermission('can ban'),
            'canUnBan' => Auth::user()->hasDirectPermission('can unban'),
        ]);
    }

    public function show(){
        return Inertia::render('Student-Management/Show');
    }

    public function ban(Request $request)
    {
        $attrs = $request->validate([
            'user_id' => 'required',
        ]);
    
        $user = User::findOrFail($attrs['user_id']);
    
        $banRecord = $user->bannedUser()->first();
    
        if ($banRecord) {
            // Update existing ban record
            $banRecord->update([
                'is_banned' => true,
                'banned_by_name' => Auth::user()->name,
                'unbanned_by_name' => null // Reset unban field
            ]);
        } else {
            // Create new ban record only if none exists
            $user->bannedUser()->create([
                'is_banned' => true,
                'banned_by_name' => Auth::user()->name
            ]);
        }
    
        return redirect()->route('student-managements.index')->with('success', 'User banned successfully.');
    }
    
    public function unBan(Request $request)
    {
        $attrs = $request->validate([
            'user_id' => 'required',
        ]);
    
        $user = User::findOrFail($attrs['user_id']);
    
        $banRecord = $user->bannedUser()->first();
    
        if ($banRecord) {
            $banRecord->update([
                'is_banned' => false,
                'unbanned_by_name' => Auth::user()->name
            ]);
        }
    
        return redirect()->route('student-managements.index')->with('success', 'User unbanned successfully.');
    }
    
}

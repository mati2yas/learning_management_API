<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\Web\StudentManagementIndexResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentManagementController extends Controller
{
    public function index(){

        $sortField = request('sort_field','created_at');
        $sortDirection = request('sort_direction', 'desc');

        $query = User::whereHas('roles', function($query) {
            $query->where('name', 'student')->where('guard_name', 'api');
        });

        // $query = $query->whereHas('roles', function($query){
        //     $query->where('name', 'student')->where('guard_name', 'web');
        // });

        if(request('name')) {
            $query->where('name','like','%'. request('name') .'%');
        }

        $users = $query->orderBy($sortField, $sortDirection)->paginate(10);

        return Inertia::render("Student-Management/Index", [
            'users' => StudentManagementIndexResource::collection( $users ),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function show(){
        return Inertia::render('Student-Management/Show');
    }

    public function ban(){

    }
}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserManagementIndexResource;
use App\Http\Resources\Web\UserEditResource;
use App\Jobs\SendCustomEmailJob;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sortField = request('sort_field','created_at');
        $sortDirection = request('sort_direction', 'desc');

        $query = User::whereHas('roles', function($query) {
            $query->where('name', 'worker')->where('guard_name', 'web');
        });

        if(request('name')) {
            $query->where('name','like','%'. request('name') .'%');
        }

        $users = $query->orderBy($sortField, $sortDirection)->with('creator','updater', 'permissions')->paginate(10);

        // dd($users);

        return Inertia::render("User-Management/Index", [
            'users' => UserManagementIndexResource::collection( $users ),
            'queryParams' => request()->query() ?: null,
            'session' => session('success'),
            'canAdd' => Auth::user()->hasDirectPermission('add worker'),
            'canUpdate' => Auth::user()->hasDirectPermission('update worker'),
            'canDelete' => Auth::user()->hasDirectPermission('delete worker'),
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(){
        return Inertia::render('User-Management/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'permissions' => 'array',
        ]);
    
        DB::beginTransaction();
    
        try {
            // Create the user
            
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'created_by' => Auth::id(),
                'email_verified_at' => Carbon::now(),
            ]);
    
            // Assign worker roles (Ensure they exist)
            $workerRoleApi = Role::where('name', 'worker')->where('guard_name', 'api')->first();
            $workerRoleWeb = Role::where('name', 'worker')->where('guard_name', 'web')->first();
    
            if ($workerRoleApi) {
                $user->assignRole($workerRoleApi);
            }
    
            if ($workerRoleWeb) {
                $user->assignRole($workerRoleWeb);
            }
    
            // Sync permissions only if provided
            if (!empty($validated['permissions'])) {
                $validPermissions = Permission::whereIn('name', $validated['permissions'])->pluck('name')->toArray();
                $user->syncPermissions($validPermissions);
            }
    
            // Dispatch email job
            dispatch(new SendCustomEmailJob($user, $validated['password']));
    
            DB::commit();
    
            return to_route('user-managements.index')->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'An error occurred while creating a user.');

        }
    }


    /**
     * Display the specified resource.
     */
    public function show()
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id){
        $user = User::findOrFail(intval($id));

        return Inertia::render('User-Management/Edit',[
            'user'=>new UserEditResource($user) ,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail(intval($id));
    
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',

            'permissions' => 'array',
        ]);
    
        // Update the user with the validated data
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'updated_by' => Auth::user()->id,
        ]);
    
        // Update the password if it is provided
        if (isset($validated['password']) && !empty($validated['password'])) {
            $user->password = bcrypt($validated['password']); // Hash the password before saving
        }
    
        // Save the user after updating the password if needed
        $user->save();
    
        // Update the user's permissions
        if (isset($validated['permissions'])) {
            // Sync the permissions using a relationship method
            $user->syncPermissions($validated['permissions']);
        }
    
        // Return a response, e.g., redirect or return success message
        return to_route('user-managements.index')->with('success','User has updated successfullu.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail(intval($id));
        $name = $user->name;
        $user->delete();

        return to_route('user-managements.index')->with('success', $name.' '.'has been deleted sucessfully.');
    }
}

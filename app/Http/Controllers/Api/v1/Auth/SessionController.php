<?php

namespace App\Http\Controllers\Api\v1\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\EmailVerificationSend;
use App\Jobs\SendCustomVerificationEmail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password as RulesPassword;

class SessionController extends Controller
{
    public function adminRegister(Request $request){
        $attrs = Validator::make($request->all(),[
            'name'=> 'required|string',
            'email'=> 'required|email|unique:users,email',
            'password'=> ['required',RulesPassword::min(4), 'confirmed'],
        ]);

        if($attrs->fails()){
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $attrs->errors()
            ], 401);
        }

        $user = User::create([
            'name'=> $request->name,
            'email' => $request->email,
            'password'=> bcrypt($request->password)
        ]);

        EmailVerificationSend::dispatch($user);
        $adminRoleApi = Role::where('name', 'admin')->where('guard_name', 'api')->first();
        $adminRoleWeb = Role::where('name', 'admin')->where('guard_name', 'web')->first();

        $user->assignRole($adminRoleApi);// assigning admin role for the api
        $user->assignRole($adminRoleWeb); // assigning admin role for the web

        return response()->json([
            'status' => true,
            'message' => 'Admin User Registered Successfully. Email Verification link sent',
            'token' => $user->createToken("API TOKEN")->plainTextToken,
            'data'=>[
                'user'=> $user,
            ]
        ]);
        
    }

    public function studentRegister(Request $request)
    {
        $attrs = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', RulesPassword::min(4), 'confirmed'],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048' // Ensuring proper image validation
        ]);
    
        if ($attrs->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $attrs->errors()
            ], 401);
        }
    
        // Handle avatar upload
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public'); // Store in storage/app/public/avatars
        }
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => $avatarPath ?? null // Set default avatar if none uploaded
        ]);
    
        $studentApi = Role::where('name', 'student')->where('guard_name', 'api')->first();

        $studentWeb = Role::where('name', 'student')->where('guard_name', 'web')->first();
    
        $user->assignRole($studentApi);
        $user->assignRole($studentWeb);
    
        // Dispatch the custom email job
        SendCustomVerificationEmail::dispatch($user);
    
        return response()->json([
            'status' => true,
            'message' => 'Student User Created Successfully. Email verification link sent.',
            'data' => ['user' => $user],
        ]);
    }
    

    public function login(Request $request)
    {
        try {
            $attrs = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => ['required', RulesPassword::min(6)],
            ]);
    
            if ($attrs->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation Error',
                    'errors' => $attrs->errors()
                ], 401);
            }
    
            $user = User::where('email', $request->email)->first();
    
            if (!$user || !Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                return response()->json([
                    'status' => false,
                    'message' => 'The credentials do not match',
                    'errors' => [
                        'message' => 'The credentials do not match'
                    ]
                ], 401);
            }
    
            // Check if the user's email is verified
            if (!$user->hasVerifiedEmail()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Your email address is not verified.',
                    'errors' => [
                        'message' => 'Please verify your email address before logging in.'
                    ]
                ], 403);
            }
    
            return response()->json([
                'status' => true,
                'message' => 'Student logged in successfully',
                'token' => $user->createToken("API TOKEN")->plainTextToken,
                'data' => ['user' => $user],
            ]);
    
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }


    public function update(Request $request)
    {
        $user = $request->user();

        // dd($request->all());
    
        $attrs = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
            // 'password' => ['required', RulesPassword::min(4), 'confirmed'],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120'
        ]);
    
        if ($attrs->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $attrs->errors()
            ], 401);
        }
    
        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
    
            // Store new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        } else {
            $avatarPath = $user->avatar; // Keep the existing avatar if no new one is uploaded
        }
    
        // Update user details
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            // 'password' => $request->password ? Hash::make($request->password) : $user->password, // Hash new password if provided
            'avatar' => $avatarPath
        ]);
    
        return response()->json([
            'status' => true,
            'message' => 'User Credentials Updated Successfully',
            'token' => $user->createToken("API TOKEN")->plainTextToken,
            'data' => [
                'user' => $user,
            ]
        ]);
    }

    public function profile(){
        $user = Auth::user();
        return response()->json([
            'status'=> true,
            'message'=> 'Profile Information',
            'data'=> $user,
            'id'=> Auth::user()->id
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(
            [
                'message' => 'Logged out'
            ]
        );
    }

    public function destroy(Request $request){
        $request->user()->delete();
        return response()->json([
            'status' => true,
            'message' => 'User Deleted Successfully'
        ]);
    }

}

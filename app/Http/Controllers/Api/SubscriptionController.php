<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Jobs\SendSubscriptionNotificationJob;
use Illuminate\Support\Facades\Storage;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $attrs = Validator::make($request->all(), [
            'course_id' => 'nullable|exists:courses,id',
            'exam_course_id' => 'nullable|exists:exam_courses,id',
            'proof_of_payment' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'status' => 'required',
            // 'total_price' => 'required',
        ]);
    
        if ($attrs->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $attrs->errors()
            ], 401);
        }
    
        // Get validated data
        $validatedData = $attrs->validated();
    
        // Handle file upload
        if ($request->hasFile('proof_of_payment')) {
            $file = $request->file('proof_of_payment');
    
            if ($file->isValid()) {
                // Generate a unique filename
                $fileName = time() . '_' . $file->getClientOriginalName();
                
                // Store the file in 'public/proof_of_payment' folder
                $path = $file->storeAs('proof_of_payment', $fileName, 'public');
    
                // Store only the relative path in validated data
                $validatedData['proof_of_payment'] = 'storage/' . $path;
            } else {
                return response()->json(['error' => 'Invalid file upload'], 400);
            }
        }
    
        // Save the subscription request
        $subscriptionRequest = $request->user()->subscriptionRequests()->create($validatedData);
    
        // Notify admins & workers
        $superAdmins = User::role('admin')->get();
        $workers = User::role('worker')->get();
        dispatch(new SendSubscriptionNotificationJob($subscriptionRequest, $superAdmins, $workers, $request->user()));
    
        return response()->json([
            'message' => 'Subscription request created successfully',
            'file_path' => asset($validatedData['proof_of_payment']), // Return correct file URL
        ]);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(SubscriptionRequest $subscriptionRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SubscriptionRequest $subscriptionRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SubscriptionRequest $subscriptionRequest)
    {
        //
    }

    public function approve(Request $request, SubscriptionRequest $subscriptionRequest)
    {
        $subscriptionRequest->update([
            'status' => 'approved',
        ]);

        $subscriptionRequest->subscription->create([
            'user_id' => $subscriptionRequest->user_id,
            'course_id' => $subscriptionRequest->course_id,
            'exam_course_id' => $subscriptionRequest->exam_course_id,
            'total_price' => $subscriptionRequest->total_price,
        ]);

        return response()->json([
            'message' => 'Subscription request approved successfully',
        ]);
    }

    public function reject(Request $request, SubscriptionRequest $subscriptionRequest)
    {
        $subscriptionRequest->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'message' => 'Subscription request rejected successfully',
        ]);
    }
}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\Web\SubscriptionRequestResource;
use App\Http\Resources\Web\SubscriptionResource;
use App\Jobs\SendSubscriptionApproveJob;
use App\Jobs\SubscriptionRejectionJob;
use App\Models\Subscription;
use App\Models\SubscriptionRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(Subscription::with('subscriptionRequest')->get());

        // dd(SubscriptionRequest::with(['user', 'courses'])->get());

        return Inertia::render('Subscriptions/Index', [

            'subscriptions' => SubscriptionResource::collection(Subscription::with([
                'subscriptionRequest.user',
                'subscriptionRequest.courses',
                // 'subscriptionRequest.examCourse',
            ])->get()),
            'subscriptionRequests' => SubscriptionRequestResource::collection(SubscriptionRequest::with(['user', 'courses'])->get()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SubscriptionRequest $subscription)
    {

        return Inertia::render('Subscriptions/Show', [
            'subscription' => new SubscriptionRequestResource($subscription->load(['user', 'courses'])),
            'canApprove' => Auth::user()->hasDirectPermission('approve subscription'),
            'canReject' => Auth::user()->hasDirectPermission('update subscription')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subscription $subscription)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subscription $subscription)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subscription $subscription)
    {
        //
    }

    public function rejection(string $id, Request $request)
    {
        try {
            $attrs = $request->validate([
                'message' => 'required|string'
            ]);
    
            DB::beginTransaction();
    
            $subscriptionRequest = SubscriptionRequest::findOrFail($id);
            $subscriptionRequest->update(['status' => "Rejected"]);
    
            $superAdmins = User::role('admin')->get();
            $workers = User::role('worker')->get();
            $user = $subscriptionRequest->user;
    
            DB::commit();
    
            // Dispatch job after successful commit
            dispatch(new SubscriptionRejectionJob($subscriptionRequest, $superAdmins, $workers, $user, $attrs['message']));
    
            return redirect()->route('subscriptions.index')->with('success', 'Subscription is rejected.');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();
            return redirect()->route('subscriptions.index')->with('error', 'Subscription request not found.');
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the error
            Log::error('Error in subscription rejection: ' . $e->getMessage());
            return redirect()->route('subscriptions.index')->with('error', 'An error occurred while rejecting the subscription.');
        }
    }

    public function approve(string $id, Request $request)
    {
        DB::beginTransaction();
    
        try {
            $subscriptionRequest = SubscriptionRequest::findOrFail($id);
    
            $subscription_start_date = Carbon::now();
        
            $durations = [
                'oneMonth' => 1,
                'threeMonths' => 3,
                'sixMonths' => 6,
                'yearly' => 12,
            ];
        
            $duration = $durations[$subscriptionRequest->subscription_type] ?? 1;
            
            $subscription_end_date = $subscription_start_date->copy()->addMonths($duration);
        
            $subscription = $subscriptionRequest->subscriptions()->create([
                'subscription_start_date' => $subscription_start_date,
                'subscription_end_date' => $subscription_end_date,
            ]);
        
            $subscriptionRequest->update(['status' => "Approved"]);
    
            $superAdmins = User::role('admin')->get();
            $workers = User::role('worker')->get();
    
            $associatedUser = User::findOrFail($subscriptionRequest->user_id);
    
            dispatch(new SendSubscriptionApproveJob($subscriptionRequest, $subscription, $superAdmins, $workers, $associatedUser));
    
            DB::commit();
    
            return redirect()->route('subscriptions.index')->with('success', 'Subscription is approved.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Subscription approval failed: ' . $e->getMessage());
            return redirect()->route('subscriptions.index')->with('error', 'Subscription approval failed. Please try again.');
        }
    }
}

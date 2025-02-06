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
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(Subscription::with('subscriptionRequest')->get());
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

    public function rejection(string $id, Request $request){

        $subscriptionRequest = SubscriptionRequest::findOrFail($id);

        $subscriptionRequest->update(['status' => "Rejected"]);

        $superAdmins = User::role('admin')->get();
        $workers = User::role('worker')->get();

        dispatch(new SubscriptionRejectionJob($subscriptionRequest, $superAdmins, $workers, $request->user()));

        return redirect()->route('subscriptions.index')->with('success', 'Subscription is rejected.');
       
    }

    public function approve(string $id, Request $request)
    {
        $subscriptionRequest = SubscriptionRequest::findOrFail($id);

    
        $subscription_start_date = Carbon::now();
    
        // Determine duration based on subscription_type
        $durations = [
            'oneMonth' => 1,
            'threeMonths' => 3,
            'sixMonths' => 6,
            'yearly' => 12,
        ];
    
        // Get the duration (default to 1 month if not found)
        $duration = $durations[$subscriptionRequest->subscription_type];
        
        // Calculate subscription end date
        $subscription_end_date = $subscription_start_date->copy()->addMonths($duration);
    
        // Store the subscription in the subscriptions table
         $subscription= $subscriptionRequest->subscriptions()->create([
            'subscription_start_date' => $subscription_start_date,
            'subscription_end_date' => $subscription_end_date,
        ]);
    
        // Save the updated subscription request
        // $subscriptionRequest->save();
        $subscriptionRequest->update(['status' => "Approved"]);

        $superAdmins = User::role('admin')->get();
        $workers = User::role('worker')->get();

        dispatch(new SendSubscriptionApproveJob($subscriptionRequest, $subscription, $superAdmins, $workers, $request->user() ));
    
        return redirect()->route('subscriptions.index')->with('success', 'Subscription is approved.');
    }
}

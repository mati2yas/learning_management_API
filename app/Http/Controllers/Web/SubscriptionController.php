<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\Web\SubscriptionRequestResource;
use App\Http\Resources\Web\SubscriptionResource;
use App\Jobs\SendSubscriptionApproveJob;
use App\Models\PaidCourse;
use App\Models\Subscription;
use App\Models\SubscriptionRequest;
use App\Models\User;
use Carbon\Carbon;
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
    public function index(Request $request)
    {
        // dd(Subscription::with('subscriptionRequest')->get());

        // dd(SubscriptionRequest::with(['user', 'courses'])->get());

        $query = SubscriptionRequest::with(['user', 'courses']);


        if ($request->filled('status')){
            $query->where('status', $request->input('status'));
        }

        $subscriptionRequests = $query->latest()->paginate(16);


        return Inertia::render('Subscriptions/Index', [

            'subscriptions' => SubscriptionResource::collection(Subscription::with([
                'subscriptionRequest.user',
                'subscriptionRequest.courses',
                // 'subscriptionRequest.examCourse',
            ])->get()),
            'subscriptionRequests' => SubscriptionRequestResource::collection($subscriptionRequests),
            'filters' => $request->only(['status']),
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

    public function approve(string $id, Request $request)
    {
        DB::beginTransaction();
    
        try {
            $subscriptionRequest = SubscriptionRequest::findOrFail($id);
    
            // Prevent duplicate approvals
            if ($subscriptionRequest->status === 'Approved') {
                return redirect()->route('subscriptions.index')->with('error', 'This subscription has already been approved.');
            }
    
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
    
            // Create PaidCourse for approved courses
            foreach ($subscriptionRequest->courses as $course) {
                $alreadyBought = PaidCourse::where('user_id', $subscriptionRequest->user_id)
                    ->where('course_id', $course->id)
                    ->exists();
    
                if (!$alreadyBought) {
                    PaidCourse::create([
                        'user_id' => $subscriptionRequest->user_id,
                        'course_id' => $course->id,
                    ]);
                }
            }
    
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

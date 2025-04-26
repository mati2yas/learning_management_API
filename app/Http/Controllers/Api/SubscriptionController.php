<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Jobs\SendSubscriptionNotificationJob;
use App\Models\Course;
use App\Models\Exam;
use App\Models\PaidCourse;
use App\Models\PaidExam;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function store(Request $request)
     {
         $attrs = Validator::make($request->all(), [
             'courses' => 'nullable|array|min:1',
             'courses.*' => 'required|exists:courses,id',
            //  'exam_course_id' => 'nullable|integer',
            //  'exam_years' => 'nullable|array|min:1',
            //  'exam_type' => 'nullable|string',
            'exams' => 'nullable|array|min:1',
            'exams.*' => 'required|exists:exams,id',
             'screenshot' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
             'subscription_type' => 'required|in:oneMonth,threeMonths,sixMonths,yearly',
             'transaction_id' => 'required',
         ]);
 
         if ($attrs->fails()) {
             return response()->json([
                 'status' => false,
                 'message' => 'Validation Error',
                 'errors' => $attrs->errors()
             ], 422);
         }
 
         $validatedData = $attrs->validated();
         $user = $request->user();
 
         // Ensure that either courses or exams are provided, but not both null
         if (empty($validatedData['courses']) && (empty($validatedData['exams']) )) {
             return response()->json([
                 'status' => false,
                 'message' => 'You must provide either courses or exam details.',
             ], 400);
         }
 
         try {
             DB::beginTransaction();
             // Check if user already owns any of the courses
             if (!empty($validatedData['courses'])) {
                 $alreadyBoughtCourses = PaidCourse::where('user_id', $user->id)
                     ->whereIn('course_id', $validatedData['courses'])->where('expired', false)
                     ->exists();
                 if ($alreadyBoughtCourses) {
                     return response()->json([
                         'status' => false,
                         'message' => 'You have already purchased one or more of the selected courses.',
                     ], 400);
                 }
             }
 
             // Check if user already owns any of the exams
             if (!empty($validatedData['exams'])) {
                 $alreadyBoughtExams = PaidExam::where('user_id', $user->id)
                     ->whereIn('exam_id', $validatedData['exams'])
                     ->where('expired', false)
                     ->exists();
                 if ($alreadyBoughtExams) {
                     return response()->json([
                         'status' => false,
                         'message' => 'You have already purchased one or more of the selected exams.',
                     ], 400);
                 }
             }
 
             // Check for existing pending request
             $existingRequest = SubscriptionRequest::where('user_id', $user->id)
                 ->where('status', 'Pending')
                 ->when(!empty($validatedData['courses']), function ($query) use ($validatedData) {
                     $query->whereHas('courses', function ($query) use ($validatedData) {
                         $query->whereIn('course_id', $validatedData['courses']);
                     });
                 })
                 ->when(!empty($validatedData['exams']), function ($query) use ($validatedData) {
                     $query->whereHas('exams', function ($query) use ($validatedData) {
                         $query->whereIn('exam_id', $validatedData['exams']);
                     });
                 })
                 ->exists();
 
             if ($existingRequest) {
                 return response()->json([
                     'status' => false,
                     'message' => 'You already have a pending subscription request for one or more selected courses/exams.',
                 ], 400);
             }
 
             if ($request->hasFile('screenshot')) {
                 $file = $request->file('screenshot');
                 $fileName = time() . '_' . $file->getClientOriginalName();
                 $path = $file->storeAs('proof_of_payment', $fileName, 'public');
                 $validatedData['proof_of_payment'] = 'storage/' . $path;
             }
 
             $totalPrice = 0;
             $subscribedItems = [];
             $totalPrice = 0; // Make sure totalPrice is initialized
             
             if (!empty($validatedData['courses'])) {
                 foreach ($validatedData['courses'] as $courseId) {
                     $course = Course::findOrFail($courseId);
                     
                     $subscribedItems[] = $course->course_name;
             
                     $priceColumn = $this->getPriceColumnBySubscriptionType($validatedData['subscription_type']);
                     if ($priceColumn) {
                         $onSaleColumn = str_replace('price_', 'on_sale_', $priceColumn);
                         $price = $course->$onSaleColumn ?? $course->$priceColumn;
                         $totalPrice += $price;
                     }
                 }
             }
             
 
             
             if (!empty($validatedData['exams'])) {
                 foreach ($validatedData['exams'] as $examId) {

                    $exam = Exam::findOrFail($examId);
                    
                    $subscribedItems[] = $exam->examCourse->course_name." ".$exam->examYear->year;
                     $priceColumn = $this->getPriceColumnBySubscriptionType($validatedData['subscription_type']);
                     if ($priceColumn) {
                         $onSaleColumn = str_replace('price_', 'on_sale_', $priceColumn);
                         $price = $exam->$onSaleColumn ?? $exam->$priceColumn;
                         $totalPrice += $price;
                     }
                 }
             }
 
             $subscriptionRequest = $user->subscriptionRequests()->create([
                 'total_price' => $totalPrice,
                 'status' => 'Pending',
                 'proof_of_payment' => $validatedData['proof_of_payment'],
                 'transaction_id' => $validatedData['transaction_id'],
                 'subscription_type' => $validatedData['subscription_type'],
             ]);
 
             if (!empty($validatedData['courses'])) {
                 $subscriptionRequest->courses()->attach($validatedData['courses']);
             }
 
             if (!empty($validatedData['exams'])) {
                 $subscriptionRequest->exams()->attach($validatedData['exams']);
             }
 
             $superAdmins = User::role('admin')->get();
             $workers = User::role('worker')->get();
 
             DB::commit();
 
             dispatch(new SendSubscriptionNotificationJob($subscriptionRequest, $superAdmins, $workers, $user));


             $message = 'You have subscribed to the following: ' . implode(', ', $subscribedItems) . '. Your part is pending.';

            $user->APINotifications()->create([
                'type' => 'subscription',
                'message' => $message,
            ]);
 
             return response()->json([
                 'status' => true,
                 'message' => 'Subscription request created successfully.',
                 'total_price' => $totalPrice,
             ], 201);
 
         } catch (\Exception $e) {
             DB::rollBack();
             Log::error('Subscription request creation failed: ' . $e->getMessage());
 
             return response()->json([
                 'status' => false,
                 'message' => 'An error occurred while processing your request. Please try again later.',
             ], 500);
         }
     }
 


     private function getPriceColumnBySubscriptionType($subscriptionType)
     {
         $mapping = [
             'oneMonth' => 'price_one_month',
             'threeMonths' => 'price_three_month',
             'sixMonths' => 'price_six_month',
             'yearly' => 'price_one_year',
         ];

         return $mapping[$subscriptionType] ?? null;
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
        if ($subscriptionRequest->status === 'approved') {
            return response()->json([
                'message' => 'This subscription has already been approved.',
            ], 400);
        }
    
        $subscriptionRequest->update([
            'status' => 'approved',
        ]);
    
        foreach ($subscriptionRequest->courses as $course) {
            PaidCourse::updateOrCreate([
                ['user_id' => $subscriptionRequest->user_id,
                'course_id' => $course->id],
                ['expired' => false]
            ]);
        }
    
        return response()->json([
            'message' => 'Subscription request approved successfully.',
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

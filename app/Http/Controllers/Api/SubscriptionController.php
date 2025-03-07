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
use App\Models\ExamType;
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
             'exam_course_id' => 'nullable|integer',
             'exam_years' => 'nullable|array|min:1',
             'exam_type' => 'nullable|string',
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
         if (empty($validatedData['courses']) && (empty($validatedData['exam_course_id']) || empty($validatedData['exam_years']) || empty($validatedData['exam_type_id']))) {
             return response()->json([
                 'status' => false,
                 'message' => 'You must provide either courses or exam details.',
             ], 400);
         }
 
         try {
             DB::beginTransaction();

             $examType = ExamType::where('name', $validatedData['exam_type'])->first();

                if (!$examType) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Invalid exam type provided.',
                    ], 400);
                }
            
            $examTypeId = $examType->id;
 
             $exams = [];
             if (!empty($validatedData['exam_course_id']) && !empty($validatedData['exam_years']) && !empty($validatedData['exam_type_id'])) {
                 // Fetch relevant exams based on exam_type_id, exam_course_id, and exam_years
                 $exams = Exam::where('exam_type_id', $examTypeId)
                 ->where('exam_course_id', $validatedData['exam_course_id'])
                 ->whereIn('exam_year_id', $validatedData['exam_years'])
                 ->get();
             }
 
             // Check if user already owns any of the courses
             if (!empty($validatedData['courses'])) {
                 $alreadyBoughtCourses = PaidCourse::where('user_id', $user->id)
                     ->whereIn('course_id', $validatedData['courses'])
                     ->exists();
                 if ($alreadyBoughtCourses) {
                     return response()->json([
                         'status' => false,
                         'message' => 'You have already purchased one or more of the selected courses.',
                     ], 400);
                 }
             }
 
             // Check if user already owns any of the exams
             if (collect($exams)->isNotEmpty()) {
                 $alreadyBoughtExams = PaidExam::where('user_id', $user->id)
                     ->whereIn('exam_id', $exams->pluck('id')->toArray())
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
                 ->when(collect($exams)->isNotEmpty(), function ($query) use ($exams) {
                     $query->whereHas('exams', function ($query) use ($exams) {
                         $query->whereIn('exam_id', $exams->pluck('id')->toArray());
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
             if (!empty($validatedData['courses'])) {
                 foreach ($validatedData['courses'] as $courseId) {
                     $course = Course::findOrFail($courseId);
                    //  dd('tre');
                     $priceColumn = $this->getPriceColumnBySubscriptionType($validatedData['subscription_type']);
                     if ($priceColumn) {
                         $onSaleColumn = str_replace('price_', 'on_sale_', $priceColumn);
                         $price = $course->$onSaleColumn ?? $course->$priceColumn;
                         $totalPrice += $price;
                     }
                 }
             }
 
             if ($exams->isNotEmpty()) {
                 foreach ($exams as $exam) {
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
 
             if ($exams->isNotEmpty()) {
                 $subscriptionRequest->exams()->attach($exams->pluck('id')->toArray());
             }
 
             $superAdmins = User::role('admin')->get();
             $workers = User::role('worker')->get();
 
             DB::commit();
 
             dispatch(new SendSubscriptionNotificationJob($subscriptionRequest, $superAdmins, $workers, $user));
 
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
            PaidCourse::create([
                'user_id' => $subscriptionRequest->user_id,
                'course_id' => $course->id,
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

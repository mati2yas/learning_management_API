<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $validator = Validator::make($request->all(), [
            'department_name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'selected_batches' => 'required|array|min:1',
            'selected_batches.*' => 'string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Create the department
        $department = Department::create([
            'department_name' => $request->department_name,
            'category_id' => $request->category_id,
        ]);

        // Create batches for each selected batch option
        foreach ($request->selected_batches as $batchName) {
            // Convert the batch ID to a readable name (e.g., '1st_year' to '1st Year')
            $readableBatchName = str_replace('_', ' ', ucfirst($batchName));
            
            Batch::create([
                'department_id' => $department->id,
                'batch_name' => $readableBatchName,
            ]);
        }

        return redirect()->route('courses.departments')->with('success', 'Department and batches created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Department $department)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Department $department)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'department_name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'selected_batches' => 'required|array|min:1',
            'selected_batches.*' => 'string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Find the department
        $department = Department::findOrFail($id);

        // Update department details
        $department->update([
            'department_name' => $request->department_name,
            'category_id' => $request->category_id,
        ]);

        // Get current batch names
        $currentBatches = $department->batches->pluck('batch_name')->map(function ($name) {
            // Convert to the same format as frontend (lowercase with underscores)
            return strtolower(str_replace(' ', '_', $name));
        })->toArray();

        // Convert selected batches to readable names
        $selectedBatchNames = collect($request->selected_batches)->map(function ($batchId) {
            return str_replace('_', ' ', ucfirst($batchId));
        })->toArray();

        // Get current batch records
        $existingBatches = $department->batches;

        // Delete batches that are no longer selected
        foreach ($existingBatches as $batch) {
            $batchKey = strtolower(str_replace(' ', '_', $batch->batch_name));
            if (!in_array($batchKey, $request->selected_batches)) {
                $batch->delete();
            }
        }

        // Add new batches that weren't previously selected
        foreach ($request->selected_batches as $batchId) {
            $readableBatchName = str_replace('_', ' ', ucfirst($batchId));
            
            // Check if this batch already exists
            $batchExists = $existingBatches->contains(function ($batch) use ($readableBatchName) {
                return $batch->batch_name === $readableBatchName;
            });

            // If it doesn't exist, create it
            if (!$batchExists) {
                Batch::create([
                    'department_id' => $department->id,
                    'batch_name' => $readableBatchName,
                ]);
            }
        }

        return redirect()->route('courses.departments')->with('success', 'Department and batches updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        $department_name = $department->department_name;
        $department->delete();

        return redirect()->route('courses.departments')->with('success', 'Department "' . $department_name . '" deleted successfully!');
    }
}

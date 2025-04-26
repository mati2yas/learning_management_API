<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\CarouselContentResource;
use App\Models\CarouselContent;
use Illuminate\Http\Request;

class CarouselContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return response()->json([
        //     'data' => CarouselContent::where('status', 'active')->get(), 
        // ]);

        return CarouselContentResource::collection(CarouselContent::where('status', 'active')->get());
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
    public function show(CarouselContent $carouselContent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CarouselContent $carouselContent)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CarouselContent $carouselContent)
    {
        //
    }
}

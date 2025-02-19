<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CarouselContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CarouselContentController extends Controller
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

        // dd($request->all());
        $attrs = $request->validate([
            'tag' => 'required|string|max:400',
            'image_url' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:active,not-active',
            'order' => 'required',
        ]);

        if ($request->hasFile('image_url')){
            $path = $request->file('image_url')->store('carousel-image', 'public');

            $attrs['image_url'] = $path;
        }

        $attrs['created_by'] = Auth::user()->id;
        $attrs['updated_by'] = Auth::user()->id;

        CarouselContent::create($attrs);

        return redirect()->route('dashboard')->with('success', 'A carousel content has created successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(CarouselContent $carouselContent)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CarouselContent $carouselContent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CarouselContent $carouselContent)
    {
        $attrs = $request->validate([
            'tag' => 'required|string|max:400',
            'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|in:active,not-active',
            'order' => 'required'
        ]);
    
        if($request->hasFile('image_url')){
            $path = $request->file('image_url')->store('carousel-image', 'public');
            $attrs['image_url'] = $path;
    
            if($carouselContent->image_url && Storage::disk('public')->exists($carouselContent->image_url)){
                Storage::disk('public')->delete($carouselContent->image_url);
            }
        } else {
            // If no new image is uploaded, keep the existing image
            unset($attrs['image_url']);
        }
    
        $attrs['updated_by'] = Auth::user()->id;
        $carouselContent->update($attrs);
    
        return redirect()->route('dashboard')->with('success', 'A carousel content has been updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CarouselContent $carouselContent)
    {
        $carouselContent->delete();

        return redirect()->route('dashboard')->with('success', 'A carousel content has deleted successfully.');
    }
}

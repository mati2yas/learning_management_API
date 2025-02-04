<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\FileContent;
use Illuminate\Http\Request;

class FileContentController extends Controller
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
        $attrs = $request->validate([
            'content_id' => 'required',
            'title' => 'required',
            'file_url' => 'required|mimes:pdf|max:40000',
        ]);


        if ($request->hasFile('file_url')) {
            $path = $request->file('file_url')->store('contents', 'public'); // Store in "storage/app/public/contents"
            $attrs['file_url'] = $path; // Add the path to attributes to save in the database
        }
        
        FileContent::create($attrs);

        return redirect()->route('contents.show', $request->content_id)->with('success', 'File Content Created Successfully.');

    }

    /**
     * Display the specified resource.
     */
    public function show(FileContent $fileContent)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FileContent $fileContent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FileContent $fileContent)
    {
        $attrs = $request->validate([
            'content_id' => 'required',
            'title' => 'required',
            'file_url' => 'nullable|mimes:pdf,docx,doc|max:40000',
        ]);
    
        // Only update the file if a new one is uploaded
        if ($request->hasFile('file_url')) {
            $path = $request->file('file_url')->store('contents', 'public');
            $attrs['file_url'] = $path;
        } else {
            // Ensure the current file path remains unchanged
            $attrs['file_url'] = $fileContent->file_url;
        }
    
        $fileContent->update($attrs);
    
        return redirect()->route('contents.show', $request->content_id)
            ->with('success', 'File Content Updated Successfully.');
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FileContent $fileContent)
    {
        $fileContent_name = $fileContent->title;
        $fileContent->delete();
        $content_id = $fileContent->content_id;

        return redirect()->route('contents.show', $content_id)->with('success', 'File Content Deleted Successfully.');
    }
}

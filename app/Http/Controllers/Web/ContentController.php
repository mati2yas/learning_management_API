<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentController extends Controller
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
            'chapter_id' => 'required|integer',
            'name' => 'required|string',
            'order' => 'required|integer',
        ]);

        Content::create($attrs);

        return redirect()->route('chapters.show', $request->chapter_id);

    }

    /**
     * Display the specified resource.
     */
    public function show(Content $content)
    {
       
        $youtube_contents = $content->youtubeContents()->get();
        $text_contents = $content->textContents()->get();
        $file_contents = $content->fileContents()->get();

        return Inertia::render('Contents/Show',
    props: [
        'content' => $content,
        'youtube_contents' => $youtube_contents,
        'text_contents' => $text_contents,
        'file_contents' => $file_contents,
        'chapter_id' => $content->chapter_id,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Content $content)
    {
        return response()->json([]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Content $content)
    {

        // dd($request->all());
        $attrs = $request->validate([
            'chapter_id' => 'required|integer',
            'name' => 'required|string',
            'order' => 'required|integer',
        ]);

        $content->update($attrs);

        return redirect()->route('chapters.show', $request->chapter_id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Content $content)
    {
        $chapter_id = $content->chapter_id;
        $content->delete();

        return to_route('chapters.show', $chapter_id)->with('success','Content Deleted Sucessfully!');
    }
}

<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\YoutubeContent;
use Illuminate\Http\Request;

class YoutubeContentController extends Controller
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
            'youtube_number' => 'required|integer|min:1',
            'title' => 'required|string',
            'url' => 'required|url',
            'content_id' => 'required'
        ]);

        YoutubeContent::create($attrs);

        return redirect()->route('contents.show', $request->content_id)->with('success', 'Youtube Content created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(YoutubeContent $youtubeContent)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(YoutubeContent $youtubeContent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, YoutubeContent $youtubeContent)
    {
        $attrs = $request->validate([
            'youtube_number' => 'required|integer|min:1',
            'title' => 'required|string',
            'url' => 'required|url',
            'content_id' => 'required'
        ]);

        $youtubeContent->update($attrs);

        return redirect()->route('contents.show', $request->content_id)->with('success', 'Youtube Content updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(YoutubeContent $youtubeContent)
    {
        $title = $youtubeContent->title;
        $content_id = $youtubeContent->content_id;

        $youtubeContent->delete();

        return redirect()->route('contents.show', $content_id)->with('success', 'Youtube Content '.$title. ' deleted successfully.');
    }
}

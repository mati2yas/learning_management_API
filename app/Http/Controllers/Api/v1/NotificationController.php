<?php


namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\APINotification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // Fetch all notifications for the authenticated user
    public function index(Request $request)
    {
        $notifications = $request->user()->APINotifications()->latest()->paginate(1);
        return response()->json($notifications);
    }

    // Mark a specific notification as read
    public function markAsRead($id, Request $request)
    {
        $notification = $request->user()->APINotifications()->findOrFail($id);
        $notification->update(['read' => true]);
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->APINotifications()->update(['read' => true]);
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read']);
    }
}

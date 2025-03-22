<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset PIN</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        h1 {
            color: #111827;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
        }
        p {
            color: #4b5563;
            font-size: 16px;
            margin-bottom: 16px;
        }
        .pin-box {
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            background-color: #e0e7ff;
            padding: 10px 20px;
            display: inline-block;
            border-radius: 6px;
            margin: 20px auto;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#2563eb" />
                        <stop offset="100%" stop-color="#3b82f6" />
                    </linearGradient>
                    <filter id="shadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3" />
                    </filter>
                </defs>
                <circle cx="50" cy="50" r="40" fill="url(#grad1)" filter="url(#shadow)" />
                <text x="50%" y="55%" text-anchor="middle" font-size="32" fill="white" font-family="Arial, sans-serif" font-weight="bold">🔐</text>
            </svg>
        </div>
        
        <h1>Hello {{ $user->name }},</h1>
        <p>We received a request to reset your password. Use the following 6-digit PIN:</p>
        
        <div class="pin-box">{{ $pin }}</div>
        
        <p>This PIN is valid for 60 minutes. Do not share it with anyone.</p>
        
        <p>If you did not request a password reset, please ignore this email.</p>
        
        <div class="footer">
            <p>This email was sent by {{ config('app.name') }}. If you need help, please contact our support team.</p>
        </div>
    </div>
</body>
</html>

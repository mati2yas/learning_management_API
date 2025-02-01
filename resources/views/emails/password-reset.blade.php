<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
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
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            text-align: center;
            transition: background-color 0.2s;
        }
        .button:hover {
            background-color: #1d4ed8;
        }
        .link {
            color: #2563eb;
            text-decoration: none;
        }
        .link:hover {
            text-decoration: underline;
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
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#2563eb" stop-opacity="1" />
                        <stop offset="100%" stop-color="#3b82f6" stop-opacity="1" />
                    </linearGradient>
                    <filter id="shadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3" />
                    </filter>
                </defs>
                <path d="M20 80 L60 80 L60 70 L30 70 L30 20 L20 20 Z" fill="url(#grad1)" filter="url(#shadow)" />
                <path d="M25 75 L55 75 L55 65 L35 65 L35 25 L25 25 Z" fill="#2563eb" />
                <path d="M27 27 L27 73 L53 73 L53 71 L29 71 L29 27 Z" fill="white" fill-opacity="0.3" />
                <circle cx="70" cy="30" r="15" fill="#3b82f6" filter="url(#shadow)" />
                <path d="M65 30 L75 30 M70 25 L70 35" stroke="white" stroke-width="3" stroke-linecap="round" />
            </svg>
        </div>
        
        <h1>Hello {{ $user->name }},</h1>
        <p>We received a request to reset your password. Click the button below to reset your password:</p>
        
        <p style="text-align: center;">
            <a href="{{ $resetUrl }}" class="button">Reset Password</a>
        </p>
        
        <p>If you did not request a password reset, please ignore this email.</p>
        
        <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
        <p><a href="{{ $resetUrl }}" class="link">{{ $resetUrl }}</a></p>
        
        <div class="footer">
            <p>This email was sent by Your App Name. If you need help, please contact our support team.</p>
        </div>
    </div>
</body>
</html>

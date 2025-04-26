<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #3d4852;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 30px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        h1 {
            color: #2d3748;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
        }
        p {
            color: #718096;
            font-size: 16px;
            margin-bottom: 16px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3490dc;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            text-align: center;
            transition: background-color 0.2s, transform 0.1s;
            margin: 16px 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .button:hover {
            background-color: #2779bd;
        }
        .button:focus {
            outline: 3px solid #bae6fd;
            background-color: #2779bd;
        }
        .button:active {
            transform: translateY(1px);
        }
        .link {
            color: #3490dc;
            text-decoration: none;
            word-break: break-all;
        }
        .link:hover {
            text-decoration: underline;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #b8c2cc;
            border-top: 1px solid #f1f5f8;
            padding-top: 20px;
        }
        @media (prefers-reduced-motion) {
            .button {
                transition: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#3490dc" stop-opacity="1" />
                        <stop offset="100%" stop-color="#6574cd" stop-opacity="1" />
                    </linearGradient>
                    <filter id="shadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3" />
                    </filter>
                </defs>
                <path d="M20 80 L60 80 L60 70 L30 70 L30 20 L20 20 Z" fill="url(#grad1)" filter="url(#shadow)" />
                <path d="M25 75 L55 75 L55 65 L35 65 L35 25 L25 25 Z" fill="#3490dc" />
                <path d="M27 27 L27 73 L53 73 L53 71 L29 71 L29 27 Z" fill="white" fill-opacity="0.3" />
                <circle cx="70" cy="30" r="15" fill="#6574cd" filter="url(#shadow)" />
                <path d="M65 30 L75 30 M70 25 L70 35" stroke="white" stroke-width="3" stroke-linecap="round" />
            </svg>
        </div>
        
        <h1>Hello {{ $user->name }},</h1>
        <p>Thank you for registering. Please verify your email address to complete your account setup.</p>
        
        <p>To verify your email, please click the button below:</p>
        <div style="text-align: center;">
            <a href="{{ $webVerificationUrl }}" class="button" role="button" aria-label="Verify Email Address">Verify Email Address</a>
        </div>
        
        <p>If you're having trouble clicking the button, you can copy and paste the following URL into your web browser:</p>
        <p><a href="{{ $webVerificationUrl }}" class="link">{{ $webVerificationUrl }}</a></p>
        
        <p>If you did not create an account, no further action is required.</p>
        
        <div class="footer">
            <p>This email was sent by Your App Name. If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
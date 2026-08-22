<!DOCTYPE html>
<html>
<head>
    <title>Procurement Document Notification</title>
    <style>
        /* Basic Reset */
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 20px;
        }
        .email-body ul {
            padding: 0;
            list-style-type: none;
        }
        .email-body ul li {
            margin-bottom: 10px;
        }
        .email-body ul li strong {
            color: #333;
        }
        .email-footer {
            background-color: #f1f1f1;
            padding: 10px;
            text-align: center;
            font-size: 14px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>Procurement Document Notification</h1>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            <h2>Hello, {{ $emailData['recipient_name'] }}</h2>
            <p>{{ $emailData['message'] }}</p>
            <h3>Procurement Document Details:</h3>
            <ul>
                <li><strong>Title:</strong> {{ $emailData['doc_title'] }}</li>
                <li><strong>Description:</strong> {{ $emailData['doc_desc'] }}</li>
                <li><strong>Status:</strong> {{ $emailData['status'] }}</li>
            </ul>
            <p>Please take the necessary action.</p>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            &copy; {{ date('Y') }} SDC x GCoEJ. All rights reserved.
        </div>
    </div>
</body>
</html>

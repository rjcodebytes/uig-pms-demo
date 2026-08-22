<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Procurement Document Update</title>
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
            <h1>Procurement Document Update</h1>
        </div>

        <!-- Body -->
        <div class="email-body">
            <h4>Dear {{ $emailData['recipient_name'] }},</h4>

            <p>Your procurement document titled "<strong>{{ $emailData['doc_title'] }}</strong>" has been updated.</p>
            <ul>
                <li><strong>Status:</strong> {{ $emailData['status'] }}</li>
                <li><strong>Description:</strong> {{ $emailData['doc_desc'] }}</li>
                <li><strong>Remark from Approver:</strong>
                    <span>{{ $emailData['remark'] ?? 'No remark provided' }}</span>
                </li>
            </ul>
            <p>{{ $emailData['message'] }}</p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p>&copy; {{ date('Y') }} SDC x GCoEJ. All rights reserved.</p>
        </div>
    </div>

</body>

</html>
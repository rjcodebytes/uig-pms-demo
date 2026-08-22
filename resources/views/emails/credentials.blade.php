<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Credentials</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        h2 {
            color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Welcome to PMS - GCoEJ!</h2>
        <p>Dear {{ $userData['name'] }},</p>
        <p>Your account has been created successfully. Below are your login credentials:</p>
        <table style="border: 1px solid #ddd; border-collapse: collapse; width: 100%;">
            <tr>
                <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">Username:</td>
                <td style="border: 1px solid #ddd; padding: 10px;">{{ $userData['username'] }}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">Temporary Password:</td>
                <td style="border: 1px solid #ddd; padding: 10px;">{{ $userData['password'] }}</td>
            </tr>
        </table>
        <p>
            Please log in to your account and change your password for security purposes.
        </p>
        <p>
            If you have any questions, feel free to contact our support team.
        </p>
        <p>Best regards,</p>
        <p>PMS - GCoEJ</p>
        <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>

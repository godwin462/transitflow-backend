export const accountRegistrationTemplate = (opt: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account - TransitFlow Nigeria</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0; padding: 0; width: 100% !important; background-color: #F3F4F6; }
        .otp-box { letter-spacing: 8px !important; }
    </style>
</head>
<body style="background-color: #F3F4F6; padding: 20px;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB;">

        <tr>
            <td align="center" style="background-color: #1F2937; padding: 40px 20px;">
                <div style="font-size: 48px; margin-bottom: 10px;">🚌</div>
                <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
                    TransitFlow <span style="color: #10B981;">Nigeria</span>
                </h1>
                <p style="color: #9CA3AF; font-size: 14px; margin-top: 5px;">Connecting your journey across Nigeria.</p>
            </td>
        </tr>

        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="color: #111827; font-size: 22px; font-weight: 700; margin-bottom: 20px;">Verify your account</h2>
                <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    Hello there,<br><br>
                    Thanks for getting started with TransitFlow Nigeria! We're excited to help you navigate your journeys. To complete your registration, please use the One-Time Password (OTP) below.
                </p>

                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center">
                            <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 24px; display: inline-block;">
                                <span style="display: block; color: #6B7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                                    Your Activation Code
                                </span>
                                <span class="otp-box" style="display: block; color: #111827; font-size: 36px; font-weight: 800; font-family: 'Courier New', Courier, monospace;">
                                    ${opt}
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>

                <p style="color: #6B7280; font-size: 14px; margin-top: 30px; margin-bottom: 25px;">
                    This code is valid for account verification only. Do not share this code with anyone, including TransitFlow support staff.
                </p>

                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFBEB; border-left: 4px solid #FBBF24; border-radius: 4px;">
                    <tr>
                        <td style="padding: 15px;">
                            <p style="color: #92400E; font-size: 14px; margin: 0;">
                                ⏱️ This OTP will expire in <strong>10 minutes</strong>. If you didn't create an account, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>
                </table>

                <p style="color: #4B5563; font-size: 14px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>The TransitFlow Team</strong>
                </p>
            </td>
        </tr>

        <tr>
            <td align="center" style="background-color: #F9FAFB; padding: 30px; border-top: 1px solid #E5E7EB;">
                <p style="color: #9CA3AF; font-size: 11px; margin-bottom: 10px;">
                    © 2023 TransitFlow Nigeria. All rights reserved.
                </p>
                <p style="color: #9CA3AF; font-size: 11px; margin-bottom: 10px;">
                    <a href="#" style="color: #10B981; text-decoration: none;">Privacy Policy</a> &nbsp;•&nbsp;
                    <a href="#" style="color: #10B981; text-decoration: none;">Terms of Service</a> &nbsp;•&nbsp;
                    <a href="#" style="color: #10B981; text-decoration: none;">Support</a>
                </p>
                <p style="color: #9CA3AF; font-size: 11px; margin: 0;">
                    Lagos, Nigeria
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

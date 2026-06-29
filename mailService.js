import nodemailer from 'nodemailer'

async function main() {
    console.log("Setting up transporter...");
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: import.meta.VITE_SMTP_USER,
            pass: import.meta.VITE_SMTP_PASS,
        }
    })

    const mailOptions = {
        from: '"Server Admin" <dramitos600@gmail.com>',
        to: "daerrox@gmail.com",
        subject: "Hello from Nodemailer! 🚀",
        text: "You successfully sent your first email from the console.",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Email</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;-webkit-font-smoothing: antialiased;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">

                            <tr>
                                <td align="center" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                        Welcome Aboard!
                                    </h1>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 40px 30px; background-color: #ffffff;">
                                    <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #334155;">
                                        Hey <strong>Ansh Kumar</strong>,
                                    </p>
                                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #475569;">
                                        Thanks for signing up! To complete your registration and secure your backend database profile, please use the verification code provided below.
                                    </p>

                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                                        <tr>
                                            <td align="center" style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 20px;">
                                                <span style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">
                                                    Verification Code
                                                </span>
                                                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; letter-spacing: 4px; color: #1e1b4b;">
                                                    5000
                                                </span>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 20px; color: #64748b; text-align: center;">
                                        This code is valid for the next 15 minutes. If you did not request this, you can safely ignore this email.
                                    </p>

                                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;">

                                    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #475569;">
                                        Cheers,<br>
                                        <strong>The Dev Team</strong>
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 20px 30px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
                                    <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 18px;">
                                        Sent automatically by your application backend.<br>
                                        © 2026 Your App Systems. All rights reserved.
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
    }

    console.log("Sending email...");

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Message sent successfully!");
        console.log("Message ID: %s", info.messageId);
    } catch (error) {
        console.error("❌ Error sending email: ", error);
    }
}


main()
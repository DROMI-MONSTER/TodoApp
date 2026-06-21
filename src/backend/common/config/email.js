import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    host: process.env.VITE_SMTP_HOST,
    port: Number(process.env.VITE_SMTP_PORT) || 587,
    auth: {
        user: process.env.VITE_SMTP_USER,
        pass: process.env.VITE_SMTP_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `"${process.env.VITE_SMTP_FROM_NAME}" <${process.env.VITE_SMTP_FROM_EMAIL}>`,
        to,
        subject,
        html
    })
}

const sendVerificationEmail = async (email, token) => {
    const url = `${process.env.VITE_CLIENT_URL}/api/auth/verify-email/${token}`;
    await sendEmail(
        email,
        "Verify your email",
        `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to verify your email.</p>`,
      );
}

const sendResetPasswordEmail = async (email, token) => {
    const url = `${process.env.VITE_CLIENT_URL}/api/auth/reset-password/${token}`;
    await sendEmail(
        email,
        "Reset your password",
        `<h2>Password Reset</h2><p>Click <a href="${url}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
      );
}


export {
    sendVerificationEmail,
    sendResetPasswordEmail
}






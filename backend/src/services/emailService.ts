import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email: string, otp: string, firstName: string) => {
  await transporter.sendMail({
    from: `"VedaAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your VedaAI account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9f9; border-radius: 12px;">
        <h2 style="color: #1a1a1a; margin-bottom: 8px;">Hi ${firstName} 👋</h2>
        <p style="color: #555; margin-bottom: 24px;">Use the OTP below to verify your VedaAI account. It expires in 10 minutes.</p>
        <div style="background: #1a1a1a; color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; border-radius: 10px;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};
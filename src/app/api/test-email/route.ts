import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/mailer";

export async function GET() {
  const adminEmail = process.env.ADMIN_EMAIL || "shvm489@gmail.com";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    return NextResponse.json({
      success: false,
      status: "CONFIG_INCOMPLETE",
      message: "SMTP_USER or SMTP_PASSWORD is not set in .env.local yet.",
      currentConfig: {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: process.env.SMTP_PORT || "465",
        user: user || "NOT_SET",
        adminEmail,
        hasPassword: Boolean(pass),
      },
      instructions: "Add your 16-character Google App Password in .env.local as SMTP_PASSWORD to send live emails.",
    });
  }

  const result = await sendEmail({
    to: adminEmail,
    subject: "✨ Velvetique Beauty — SMTP Test Email",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #f3d7dc; border-radius: 8px; max-width: 500px; margin: auto;">
        <h2 style="color: #3a1f2c; margin-top: 0;">🎉 SMTP Connection Successful!</h2>
        <p style="color: #555; line-height: 1.5;">This is a test notification from your Velvetique Beauty store.</p>
        <div style="background-color: #fdf6f7; padding: 12px 16px; border-radius: 6px; border-left: 3px solid #b55b6c; font-size: 13px;">
          <strong>Target Email:</strong> ${adminEmail}<br>
          <strong>Status:</strong> Active & Ready to receive orders and contact messages!
        </div>
        <p style="color: #888; font-size: 11px; margin-top: 20px;">Timestamp: ${new Date().toLocaleString()}</p>
      </div>
    `,
  });

  if (result.success) {
    return NextResponse.json({
      success: true,
      message: `Test email successfully sent to ${adminEmail}!`,
    });
  } else {
    return NextResponse.json({
      success: false,
      error: result.error,
      message: "SMTP authentication failed. Please check your SMTP_PASSWORD (Google App Password).",
    });
  }
}

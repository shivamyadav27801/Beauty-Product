import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const fromEmail = process.env.SMTP_FROM_EMAIL || "care@velvetiquebeauty.com";
  const fromName = process.env.SMTP_FROM_NAME || "Velvetique Beauty";

  if (!host || !user || !pass) {
    console.log(`[SMTP Not Configured / Dev Mode] Would send email to: ${to} | Subject: ${subject}`);
    // In local dev without live SMTP credentials, return success: false or test simulation
    return { success: false, error: "SMTP credentials not configured" };
  }

  try {
    const isGmail = (host && host.toLowerCase().includes("gmail")) || (user && user.toLowerCase().endsWith("@gmail.com"));
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transportConfig: any = isGmail
      ? {
          service: "gmail",
          auth: {
            user,
            pass,
          },
        }
      : {
          host,
          port,
          secure,
          auth: {
            user,
            pass,
          },
        };

    const transporter = nodemailer.createTransport(transportConfig);

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
      replyTo,
    });

    console.log(`[SMTP Success] Sent email to: ${to} | Subject: ${subject}`);
    return { success: true };
  } catch (error) {
    console.error("[SMTP Error]:", error);
    return { success: false, error: error instanceof Error ? error.message : "SMTP send failed" };
  }
}

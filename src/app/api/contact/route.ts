import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { ContactInquiry } from "@/models/ContactInquiry";
import { sendEmail } from "@/lib/email/mailer";
import {
  getContactInquiryAdminEmail,
  getContactInquiryCustomerConfirmation,
} from "@/lib/email/templates";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().max(20).optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = result.data;

    await connectDB();

    const inquiry = await ContactInquiry.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      subject: subject.trim(),
      message: message.trim(),
      status: "NEW",
    });

    const adminEmailAddress = process.env.ADMIN_EMAIL || "shvm489@gmail.com";

    // 1. Send notification email to admin with reply-to as customer
    const adminTemplate = getContactInquiryAdminEmail({
      name,
      email,
      phone,
      subject,
      message,
      date: new Date(),
    });

    sendEmail({
      to: adminEmailAddress,
      subject: adminTemplate.subject,
      html: adminTemplate.html,
      replyTo: email,
    }).catch((err) => console.error("Admin contact notification error:", err));

    // 2. Send confirmation email to customer
    const customerTemplate = getContactInquiryCustomerConfirmation(name);
    sendEmail({
      to: email,
      subject: customerTemplate.subject,
      html: customerTemplate.html,
    }).catch((err) => console.error("Customer contact confirmation error:", err));

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting Velvetique Beauty. Your message has been received.",
      inquiryId: inquiry._id.toString(),
    });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit message. Please try again later." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { contactFormSchema } from "@repo/validation";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, company, service, message } = parsed.data;

    // Escape all user input before embedding in HTML email
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company);
    const safeService = service ? escapeHtml(service) : "";
    const safeMessage = escapeHtml(message);

    // Send email to your team's shared inbox via Resend
    // Set RESEND_API_KEY and CONTACT_EMAIL in your .env
    const teamEmail = process.env.CONTACT_EMAIL || "hello@wam.com";

    if (process.env.RESEND_API_KEY) {
      await getResend().emails.send({
        from: "WAM <noreply@wam.com>",
        to: [teamEmail],
        replyTo: email,
        subject: `New Contact: ${safeName} from ${safeCompany}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h2 style="color: #D97706;">New Contact Form Submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Name</td><td style="padding: 8px 0;">${safeName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Company</td><td style="padding: 8px 0;">${safeCompany}</td></tr>
              ${safeService ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Service Interest</td><td style="padding: 8px 0;">${safeService}</td></tr>` : ""}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f5f5f4; border-radius: 8px;">
              <p style="font-weight: bold; color: #666; margin: 0 0 8px;">Message</p>
              <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
            </div>
            <p style="margin-top: 24px; color: #999; font-size: 12px;">
              Sent from wam.com contact form
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully. We'll be in touch within 24 hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

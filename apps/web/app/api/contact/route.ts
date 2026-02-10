import { NextResponse } from "next/server";
import { contactFormSchema } from "@repo/validation";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
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

    // Send email to your team's shared inbox via Resend
    // Set RESEND_API_KEY and CONTACT_EMAIL in your .env
    const teamEmail = process.env.CONTACT_EMAIL || "hello@streamlineassociates.com";

    if (process.env.RESEND_API_KEY) {
      await getResend().emails.send({
        from: "Stremeline Associates <noreply@stremelineassociates.com>",
        to: [teamEmail],
        replyTo: email,
        subject: `New Contact: ${name} from ${company}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h2 style="color: #D97706;">New Contact Form Submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Company</td><td style="padding: 8px 0;">${company}</td></tr>
              ${service ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Service Interest</td><td style="padding: 8px 0;">${service}</td></tr>` : ""}
            </table>
            <div style="margin-top: 16px; padding: 16px; background: #f5f5f4; border-radius: 8px;">
              <p style="font-weight: bold; color: #666; margin: 0 0 8px;">Message</p>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin-top: 24px; color: #999; font-size: 12px;">
              Sent from streamlineassociates.com contact form
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

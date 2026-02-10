import { NextResponse } from "next/server";
import { newsletterSchema } from "@repo/validation";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let body: Record<string, unknown>;
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    }
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // For now, just log — integrate with email service later
    console.log("Newsletter signup:", parsed.data.email);

    return NextResponse.json({
      success: true,
      message: "Thanks for subscribing!",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

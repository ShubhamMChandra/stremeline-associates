import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "WAM";
  const description =
    searchParams.get("description") ||
    "Your operations, minus the busywork.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#F4F2EC",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              backgroundColor: "#E5481F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <span
            style={{
              fontSize: "34px",
              fontWeight: 600,
              letterSpacing: "-0.05em",
              color: "#16150F",
            }}
          >
            wam
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 600,
            color: "#16150F",
            lineHeight: 1.1,
            letterSpacing: "-0.045em",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "20px",
            color: "#5E5B52",
            marginTop: "20px",
            maxWidth: "600px",
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>

        {/* Ink rule */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "2px",
            backgroundColor: "#16150F",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

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
          backgroundColor: "#F4F0E3",
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
              width: "88px",
              height: "18px",
              marginRight: "-92px",
              marginTop: "14px",
              backgroundColor: "#FFE34D",
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
              color: "#151514",
            }}
          >
            wam
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#151514",
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
            color: "#66625A",
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
            backgroundColor: "#151514",
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

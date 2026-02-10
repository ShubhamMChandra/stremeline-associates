"use client";

import { useState } from "react";
import { Input, Button } from "@repo/ui";

/**
 * What this does: Client-side newsletter signup form
 * Why it's here: Submits via fetch to prevent full-page navigation
 * How it works: Posts email as JSON to /api/newsletter, shows success/error inline
 * Dependencies: @repo/ui
 */

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const email = new FormData(form).get("email");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-primary">Thanks for subscribing!</p>
    );
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="newsletter-email"
        type="email"
        name="email"
        placeholder="you@company.com"
        required
        className="h-11 text-xs"
      />
      <Button type="submit" size="sm" className="h-11" disabled={status === "loading"}>
        {status === "loading" ? "..." : "Subscribe"}
      </Button>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-1">Something went wrong. Try again.</p>
      )}
    </form>
  );
}

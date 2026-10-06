import Link from "next/link";
import { Logo, Container } from "@repo/ui";
import { footerNav, siteConfig } from "@repo/content";
import { NewsletterForm } from "./newsletter-form";

/**
 * What this does: Site footer with contact line, nav columns, and newsletter signup
 * Why it's here: Secondary navigation and a last, low-pressure way to get in touch
 * How it works: Server component; one hairline above, plain text columns
 * Dependencies: @repo/ui, @repo/content, NewsletterForm
 */

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.tagline}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-block text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Company</p>
            <ul className="space-y-1">
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <Link href="/services" className="text-sm font-medium text-foreground">
              Services
            </Link>
            <ul className="space-y-1">
              {footerNav.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Field notes</p>
            <p className="text-sm text-muted-foreground">
              Occasional notes on what we automate and what we leave alone.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <p className="mt-16 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} WAM
        </p>
      </Container>
    </footer>
  );
}

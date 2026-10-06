import Link from "next/link";
import { Logo, Container } from "@repo/ui";
import { footerNav, siteConfig } from "@repo/content";
import { NewsletterForm } from "./newsletter-form";

/**
 * What this does: Site footer with contact, nav columns, and newsletter signup
 * Why it's here: Secondary navigation and a last, low-pressure way to get in touch
 * How it works: Server component; one hairline above, small text columns
 * Dependencies: @repo/ui, @repo/content, NewsletterForm
 */

const item = "inline-block py-1 text-[14px] text-foreground/65 transition-colors hover:text-foreground";

export function Footer() {
  return (
    <footer className="border-t border-foreground/15">
      <Container className="grid gap-12 py-14 md:grid-cols-12 md:gap-8 md:py-16">
        <div className="space-y-4 md:col-span-4">
          <Logo />
          <p className="max-w-[18rem] text-[14px] leading-relaxed text-foreground/65">
            {siteConfig.tagline}
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-block text-[14px] underline decoration-foreground/30 underline-offset-[5px] hover:decoration-foreground"
          >
            {siteConfig.email}
          </a>
        </div>

        <nav aria-label="Company" className="md:col-span-2">
          <ul>
            {footerNav.company.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={item}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services" className="md:col-span-2">
          <ul>
            {footerNav.services.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={item}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 md:col-span-4">
          <p className="text-[14px] text-foreground/65">
            Notes on what we automate and what we leave alone, now and then.
          </p>
          <NewsletterForm />
        </div>

        <p className="text-[13px] text-muted-foreground md:col-span-12 md:pt-6">
          &copy; {new Date().getFullYear()} WAM. Highlighters not included.
        </p>
      </Container>
    </footer>
  );
}

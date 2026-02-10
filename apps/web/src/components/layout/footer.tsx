import Link from "next/link";
import { Logo, Container, Separator } from "@repo/ui";
import { footerNav, siteConfig } from "@repo/content";
import { NewsletterForm } from "./newsletter-form";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-1">
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <Link href="/services" className="text-sm font-semibold text-foreground transition-colors hover:text-primary">
              Services
            </Link>
            <ul className="space-y-1">
              {footerNav.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Get insights on AI automation for your business.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Stremeline Associates. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Less overhead. More output. Agents that just work.
          </p>
        </div>
      </Container>
    </footer>
  );
}

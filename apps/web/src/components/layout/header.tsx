"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, cn } from "@repo/ui";
import { mainNav } from "@repo/content";
import { MobileNav } from "./mobile-nav";

/**
 * What this does: Fixed site header with wordmark, nav, and contact link
 * Why it's here: Primary navigation for all pages
 * How it works: Sits on the paper ground; a hairline appears once the page scrolls.
 *   Active page is marked with an underline, no pills or animated indicators.
 * Dependencies: @repo/ui, @repo/content
 */

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-background transition-colors duration-200",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 md:px-8">
        <Link href="/" aria-label="WAM home" className="py-2">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-[15px] underline-offset-[6px] transition-colors",
                  active
                    ? "text-foreground underline decoration-foreground/40"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="inline-flex h-10 items-center bg-foreground px-4 text-[15px] font-medium text-background transition-colors hover:bg-foreground/85"
          >
            Book an audit
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}

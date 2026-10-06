"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, cn } from "@repo/ui";
import { mainNav } from "@repo/content";
import { MobileNav } from "./mobile-nav";

/**
 * What this does: Fixed site header with wordmark, nav, and the audit link
 * Why it's here: Primary navigation for all pages
 * How it works: Transparent over the page until it scrolls, then takes the page ground and a hairline. The current
 *   page is marked with the highlighter stroke, the same mark used across the site.
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
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200",
        scrolled ? "border-border bg-background/95 backdrop-blur-[2px]" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="WAM home" className="py-2">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "marker-hover text-[14px] transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className={cn("marker", active && "is-drawn")}>{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="ml-2 inline-flex h-9 items-center rounded-full bg-foreground px-4 text-[14px] font-medium text-background transition-colors hover:bg-foreground/85"
          >
            Book an audit
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Logo, Button, cn } from "@repo/ui";
import { mainNav } from "@repo/content";
import { MobileNav } from "./mobile-nav";

/**
 * What this does: Fixed site header with floating pill nav on scroll
 * Why it's here: Primary navigation for all pages
 * How it works: Transparent on top, transitions to a frosted glass floating bar
 *   with rounded corners and subtle border on scroll. Active page gets an animated
 *   underline indicator via Motion layoutId.
 * Dependencies: motion/react, @repo/ui, @repo/content
 */

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "top-3 px-4 md:px-6" : "top-0 px-0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[1100px] items-center justify-between transition-all duration-500",
          scrolled
            ? "glass rounded-full border border-white/[0.06] px-5 shadow-lg shadow-black/10"
            : "h-16 rounded-none border-transparent px-6 md:px-8",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Stremeline Associates — home"
        >
          <Logo />
        </Link>

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Main navigation"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
              )}
            >
              {item.label}
              {pathname === item.href && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-full bg-white/[0.06]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild size="sm" className="rounded-full">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>

        <MobileNav />
      </div>
    </motion.header>
  );
}

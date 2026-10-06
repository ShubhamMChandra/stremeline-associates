"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent, SheetClose, Button, Logo, cn } from "@repo/ui";
import { mainNav } from "@repo/content";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-foreground/5 lg:hidden"
          aria-label="Open menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="17" y2="6" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <line x1="3" y1="14" x2="17" y2="14" />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col gap-8 pt-8">
          <Logo />
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {mainNav.map((item) => (
              <SheetClose key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "px-1 py-3 text-xl font-medium tracking-tight transition-colors",
                    pathname === item.href
                      ? "text-foreground underline underline-offset-[6px]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
          <SheetClose asChild>
            <Button asChild className="w-full">
              <Link href="/contact">Book an audit</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

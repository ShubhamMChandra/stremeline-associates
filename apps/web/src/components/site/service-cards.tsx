import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@repo/content";
import { notes, paper } from "./paper";

/**
 * What this does: The four services as white paper cards with a small colored tab
 * Why it's here: Used on the homepage and the services page so both stay identical
 * How it works: Server component; an optional slug is left out (for "other services" lists)
 * Dependencies: @repo/content, lucide-react, paper styles
 */

export function ServiceCards({ exclude }: { exclude?: string }) {
  const list = services.filter((s) => s.slug !== exclude);
  return (
    <ul className={`grid gap-4 md:gap-5 ${list.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
      {list.map((s) => {
        const i = services.findIndex((x) => x.slug === s.slug);
        return (
          <li key={s.slug}>
            <Link
              href={`/services/${s.slug}`}
              className={`group relative flex h-full flex-col p-6 pt-9 transition-transform duration-300 hover:-translate-y-0.5 md:p-8 md:pt-11 ${paper}`}
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-6 h-3 w-12 rounded-b-[3px] md:left-8"
                style={{ background: notes[i % 4] }}
              />
              <h3 className="text-[22px] leading-tight font-semibold tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-foreground/70">{s.description}</p>
              <p className="mt-6 flex items-center justify-between gap-4 text-[13px] text-muted-foreground">
                <span>{s.tools?.slice(0, 4).join(", ")}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

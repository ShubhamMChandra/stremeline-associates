import type { CaseStudy } from "@repo/types";
import { cn } from "@repo/ui";
import { paper } from "./paper";

/**
 * What this does: A case study's results as one card: response-time bars, then the other numbers
 * Why it's here: Shows the before and after at a glance on the homepage and case study pages
 * How it works: Server component. The first result with a before value becomes a two-bar
 *   comparison; the rest are small figures. Bar widths are illustrative of the gap, not to scale.
 * Dependencies: @repo/types, @repo/ui cn, paper styles
 */

export function ResultsCard({ study, className = "" }: { study: CaseStudy; className?: string }) {
  const [lead, ...rest] = study.results;
  return (
    <div className={cn("p-6 md:p-8", paper, className)}>
      {lead && (
        <>
          <p className="text-[14px] font-medium">{lead.metric}</p>
          <div className="mt-4 space-y-3">
            {[
              { label: "Before", value: lead.before, bar: "w-full bg-foreground/15" },
              { label: "After", value: lead.after, bar: "w-3 bg-marker" },
            ]
              .filter((b) => b.value)
              .map((b) => (
                <div key={b.label} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3">
                  <span className="text-[13px] text-muted-foreground">{b.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={`h-3 rounded-full ${b.bar}`} />
                    <span className="shrink-0 text-[13px] font-medium">{b.value}</span>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
      {rest.length > 0 && (
        <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
          {rest.map((r) => (
            <div key={r.metric} className="flex flex-col-reverse justify-end">
              <dt className="mt-2 text-[13px] leading-snug text-muted-foreground">{r.metric}</dt>
              <dd className="text-[22px] leading-none font-semibold tracking-[-0.02em]">{r.after}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

"use client";

import { useReducedMotion, AnimateOnScroll } from "@repo/animation";
import { Container, Heading } from "@repo/ui";

/**
 * What this does: Before/after contrast section — shows the manual-work problem and the fix
 * Why it's here: Creates narrative tension between hero promise and capabilities proof.
 *   The visitor should FEEL the waste, then feel the relief.
 * How it works: Two-column layout — left shows the bloated manual day, right shows the
 *   compressed automated version. Big impact numbers lead, task detail supports.
 *   No horizontal scroll — the point hits in one viewport.
 * Dependencies: @repo/ui, @repo/animation
 */

interface Task {
  name: string;
  minutes: number;
  type: "meeting" | "manual";
}

// Times based on typical mid-market B2B ops team (5-15 reps).
// Manual = work an agent can own. Meeting = requires a human.
const TASKS: Task[] = [
  { name: "Morning standup", minutes: 25, type: "meeting" },
  { name: "New lead intake from CRM", minutes: 35, type: "manual" },
  { name: "Data entry & record syncing", minutes: 50, type: "manual" },
  { name: "Client & prospect calls", minutes: 65, type: "meeting" },
  { name: "Follow-up emails & sequences", minutes: 25, type: "manual" },
  { name: "Reporting & dashboards", minutes: 40, type: "manual" },
  { name: "Pipeline review", minutes: 20, type: "meeting" },
  { name: "Admin & ticket cleanup", minutes: 30, type: "manual" },
];

// manual: 35 + 50 + 25 + 40 + 30 = 180 min = 3.0 hrs
const manualMinutes = TASKS.filter((t) => t.type === "manual").reduce(
  (sum, t) => sum + t.minutes,
  0,
);
const manualHours = (manualMinutes / 60).toFixed(1);

// After automation: ~35 min of human review/exceptions per day.
// That's an ~80% reduction — aggressive but credible for well-scoped automation.
const AFTER_MINUTES = 35;

export function ProblemScroll() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      aria-label="The problem — how much time your team loses to manual work"
      className="pt-12 pb-12 md:pt-16 md:pb-14"
    >
      <Container>
        {/* Section intro — narrative bridge from hero */}
        <AnimateOnScroll>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary/70">
            The problem
          </p>
          <Heading as="h2" size="h2">
            Where the hours actually go.
          </Heading>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            A typical ops team&apos;s day looks like this — over three hours of
            it is work a machine should be doing.
          </p>
        </AnimateOnScroll>

        {/* Before / After columns */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-6">
          {/* ── BEFORE ── */}
          <AnimateOnScroll>
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <div className="mb-6 flex items-baseline justify-between">
                <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Today
                </p>
                <span className="font-mono text-3xl font-light tracking-tight text-foreground md:text-4xl">
                  {manualHours}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    hrs / day
                  </span>
                </span>
              </div>
              <p className="mb-5 text-sm text-muted-foreground">
                Manual work spread across the day, per rep
              </p>
              <div className="flex flex-wrap gap-2">
                {TASKS.map((task) => {
                  const isManual = task.type === "manual";
                  return (
                    <span
                      key={task.name}
                      className={[
                        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs",
                        isManual
                          ? "border-primary/20 bg-primary/[0.06] text-primary"
                          : "border-border bg-transparent text-muted-foreground",
                      ].join(" ")}
                    >
                      {task.name}
                      <span className="font-mono text-[10px] opacity-60">
                        {task.minutes}m
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          </AnimateOnScroll>

          {/* ── AFTER ── */}
          <AnimateOnScroll>
            <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8">
              <div className="mb-6 flex items-baseline justify-between">
                <p className="text-sm font-medium uppercase tracking-wider text-primary">
                  With Stremeline
                </p>
                <span className="font-mono text-3xl font-light tracking-tight text-foreground md:text-4xl">
                  ~{AFTER_MINUTES}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    min / day
                  </span>
                </span>
              </div>
              <p className="mb-5 text-sm text-muted-foreground">
                Agents run the workflows — your team reviews exceptions
              </p>
              <div className="flex flex-wrap gap-2">
                {TASKS.map((task) => {
                  const isManual = task.type === "manual";
                  return (
                    <span
                      key={task.name}
                      className={[
                        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-all",
                        isManual
                          ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400 line-through opacity-60"
                          : "border-border bg-transparent text-muted-foreground",
                      ].join(" ")}
                    >
                      {task.name}
                      {isManual && (
                        <span className="font-mono text-[10px] font-semibold text-emerald-500 no-underline">
                          auto
                        </span>
                      )}
                      {!isManual && (
                        <span className="font-mono text-[10px] opacity-60">
                          {task.minutes}m
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Emotional closer — the "so what" */}
        <AnimateOnScroll>
          <p
            className="mx-auto mt-10 max-w-2xl text-center text-2xl leading-relaxed italic text-foreground/80 md:mt-12 md:text-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            What if your team only did the work that needed a human?
          </p>
        </AnimateOnScroll>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@repo/ui";
import { useReducedMotion } from "@repo/animation";

/**
 * What this does: Tabbed workflow map showing where an agent runs and where a person stays in
 * Why it's here: Shows the method instead of describing it. Every engagement starts with a map like this
 * How it works: Plays each process step by step while in view, cycling through tabs until the
 *   visitor picks one. A filled signal square marks a step an agent runs; a hollow square marks
 *   a step that stays with a person. The signal color does nothing else. Reduced motion shows all rows.
 * Dependencies: React state, @repo/ui cn, @repo/animation
 */

interface Row {
  step: string;
  tool: string;
  agent: string | null;
  check: string;
}

interface Workflow {
  key: string;
  label: string;
  title: string;
  rows: Row[];
}

const workflows: Workflow[] = [
  {
    key: "leads",
    label: "Lead intake",
    title: "A new inquiry arrives at 11pm",
    rows: [
      { step: "Capture the inquiry", tool: "Web forms, shared inbox", agent: "Picks it up the moment it lands and checks the contact data", check: "Bad records go to a review queue" },
      { step: "Enrich the record", tool: "CRM, data providers", agent: "Adds company size, industry, and tech stack", check: "Every source is logged on the record" },
      { step: "Score the lead", tool: "CRM", agent: "Scores it against the criteria you define", check: "Your team owns and edits the criteria" },
      { step: "Route to a rep", tool: "CRM, Slack", agent: "Assigns by territory, deal size, and product", check: "Reps can reassign with one click" },
      { step: "First conversation", tool: "Phone, email", agent: null, check: "Stays with your rep" },
    ],
  },
  {
    key: "crm",
    label: "CRM hygiene",
    title: "Keeping the CRM honest",
    rows: [
      { step: "Agree on what clean means", tool: "A one-page standard", agent: null, check: "Your ops lead owns the standard" },
      { step: "Normalize fields on every write", tool: "HubSpot, Salesforce", agent: "Fixes formats as records are created or changed", check: "Changes are reversible and logged" },
      { step: "Merge duplicates", tool: "CRM", agent: "Matches likely duplicates and merges them", check: "Low-confidence matches wait for approval" },
      { step: "Fill sparse records", tool: "Approved data sources", agent: "Completes missing fields", check: "Only from sources you approve" },
      { step: "Flag anomalies", tool: "Slack", agent: "Posts anything unusual to a channel", check: "A person decides what to do about it" },
    ],
  },
  {
    key: "handoff",
    label: "Sales to onboarding",
    title: "A deal closes on Friday afternoon",
    rows: [
      { step: "Deal marked closed-won", tool: "CRM", agent: "Picks up the change as it happens", check: "Runs only on the stages you choose" },
      { step: "Create the project board and docs", tool: "Asana, Notion", agent: "Builds them from your templates", check: "Templates stay under your control" },
      { step: "Brief the delivery team", tool: "Slack", agent: "Posts a summary with links back to the deal", check: "Nothing sent outside the company" },
      { step: "Kickoff call", tool: "Calendar", agent: null, check: "Stays with the account lead" },
      { step: "Keep a record", tool: "Audit log", agent: "Logs every action it took", check: "Anyone on the team can review it" },
    ],
  },
  {
    key: "reporting",
    label: "Weekly reporting",
    title: "The Monday pipeline report",
    rows: [
      { step: "Pull pipeline data", tool: "Salesforce, HubSpot", agent: "Gathers the numbers over the weekend", check: "Read-only access" },
      { step: "Compare with last week", tool: "Sheets", agent: "Flags drops past the thresholds you set", check: "Thresholds set by your team" },
      { step: "Draft the summary", tool: "Docs, Slack", agent: "Writes a first pass in plain language", check: "Every number links to its source" },
      { step: "Decide what to do", tool: "Leadership meeting", agent: null, check: "Stays with leadership" },
    ],
  },
];

const STEP_MS = 1500;
const HOLD_MS = 2200;

function Mark({ agent, live = false }: { agent: boolean; live?: boolean }) {
  return (
    <span aria-hidden="true" className="relative inline-flex size-2.5 shrink-0">
      {live && agent && (
        <span className="absolute inset-0 animate-ping bg-signal opacity-60 [animation-duration:1.4s]" />
      )}
      <span
        className={cn(
          "relative inline-block size-2.5",
          agent ? "bg-signal" : "border-[1.5px] border-foreground/40",
        )}
      />
    </span>
  );
}

export function WorkflowMap() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  const workflow = workflows[tab]!;
  const total = workflow.rows.length;
  const playing = !reducedMotion && inView && !hovered;
  const shown = reducedMotion ? total : step;
  const agentCount = workflow.rows.filter((r) => r.agent).length;
  const humanCount = total - agentCount;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const done = step >= total;
    const t = setTimeout(
      () => {
        if (!done) {
          setStep((s) => s + 1);
        } else {
          if (!pinned) setTab((i) => (i + 1) % workflows.length);
          setStep(0);
        }
      },
      done ? HOLD_MS : step === 0 ? 500 : STEP_MS,
    );
    return () => clearTimeout(t);
  }, [playing, step, total, pinned]);

  function pick(i: number) {
    setTab(i);
    setStep(reducedMotion ? total : 1);
    setPinned(true);
  }

  const current = workflow.rows[Math.max(0, Math.min(shown, total) - 1)];
  const status =
    shown >= total
      ? `Done. ${agentCount} steps automated, ${humanCount} ${humanCount === 1 ? "stays" : "stay"} human`
      : shown === 0
        ? "Starting"
        : `Step ${shown} of ${total}: ${current?.agent ? "agent running" : "handed to a person"}`;

  const rowState = (i: number) => (i < shown - 1 ? "done" : i === shown - 1 ? "live" : "next");

  return (
    <figure
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="m-0 bg-surface p-5 ring-1 ring-foreground/10 sm:p-8 md:p-10"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Example workflow" className="flex flex-wrap gap-1">
          {workflows.map((w, i) => (
            <button
              key={w.key}
              type="button"
              aria-pressed={i === tab}
              onClick={() => pick(i)}
              className={cn(
                "relative min-h-10 overflow-hidden px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                i === tab
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {w.label}
              {i === tab && !reducedMotion && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-[2px] bg-signal transition-[width] duration-500 ease-out"
                  style={{ width: `${(Math.min(shown, total) / total) * 100}%` }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <Mark agent />
            Agent runs it
          </span>
          <span className="flex items-center gap-2">
            <Mark agent={false} />
            Stays with a person
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-9 pb-4">
        <h3 className="text-2xl font-semibold tracking-[-0.025em] md:text-[32px]">
          {workflow.title}
        </h3>
        <p aria-live="polite" className="font-mono text-xs text-muted-foreground">
          {status}
        </p>
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-[20px_1.1fr_0.9fr_1.5fr_1.2fr] gap-5 border-b border-foreground/15 py-2.5 font-mono text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
          <span />
          <span>Step</span>
          <span>Where it lives</span>
          <span>What the agent does</span>
          <span>The check</span>
        </div>
        {workflow.rows.map((r, i) => {
          const state = rowState(i);
          return (
            <div
              key={`${workflow.key}-${r.step}`}
              className={cn(
                "-mx-3 grid grid-cols-[20px_1.1fr_0.9fr_1.5fr_1.2fr] items-center gap-5 border-b border-border px-3 py-4 text-[15px] transition-[opacity,background-color] duration-500 last:border-b-0",
                state === "next" && "opacity-30",
                state === "live" && "bg-foreground/[0.035]",
              )}
            >
              <Mark agent={Boolean(r.agent)} live={state === "live"} />
              <span className="font-medium">{r.step}</span>
              <span className="text-muted-foreground">{r.tool}</span>
              <span className={r.agent ? "text-foreground" : "text-muted-foreground"}>
                {r.agent ?? "Stays with a person"}
              </span>
              <span className="text-muted-foreground">{r.check}</span>
            </div>
          );
        })}
      </div>

      <ol className="md:hidden">
        {workflow.rows.map((r, i) => {
          const state = rowState(i);
          return (
            <li
              key={`${workflow.key}-${r.step}`}
              className={cn(
                "flex gap-3 border-b border-border py-4 transition-opacity duration-500 last:border-b-0",
                state === "next" && "opacity-30",
              )}
            >
              <span className="pt-1.5">
                <Mark agent={Boolean(r.agent)} live={state === "live"} />
              </span>
              <div className="min-w-0 space-y-1">
                <p className="text-[15px] font-medium">{r.step}</p>
                <p className="text-sm text-foreground/80">{r.agent ?? "Stays with a person"}</p>
                <p className="text-[13px] text-muted-foreground">
                  {r.tool}. {r.check}.
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <figcaption className="pt-6 text-[13px] text-muted-foreground">
        Illustrative. Every engagement starts by mapping one of your own processes like this.
      </figcaption>
    </figure>
  );
}

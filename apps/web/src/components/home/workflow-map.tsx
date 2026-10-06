"use client";

import { useState } from "react";
import { cn } from "@repo/ui";

/**
 * What this does: Tabbed workflow map showing where an agent runs and where a person stays in
 * Why it's here: Shows the method instead of describing it. Every engagement starts with a map like this
 * How it works: Client tabs swap the process. A filled signal square marks a step an agent runs;
 *   a hollow square marks a step that stays with a person. The signal color does nothing else.
 * Dependencies: React state, @repo/ui cn
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

function Mark({ agent }: { agent: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-2.5 shrink-0",
        agent ? "bg-signal" : "border-[1.5px] border-foreground/40",
      )}
    />
  );
}

export function WorkflowMap() {
  const [active, setActive] = useState(workflows[0]!.key);
  const workflow = workflows.find((w) => w.key === active) ?? workflows[0]!;
  const agentCount = workflow.rows.filter((r) => r.agent).length;
  const humanCount = workflow.rows.length - agentCount;

  return (
    <figure className="m-0 border-y border-foreground/15 py-6 md:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Example workflow" className="flex flex-wrap gap-1">
          {workflows.map((w) => (
            <button
              key={w.key}
              type="button"
              aria-pressed={w.key === active}
              onClick={() => setActive(w.key)}
              className={cn(
                "min-h-10 px-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                w.key === active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {w.label}
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

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pt-8 pb-3">
        <h3 className="text-2xl font-semibold tracking-[-0.025em] md:text-[28px]">
          {workflow.title}
        </h3>
        <p className="font-mono text-xs text-muted-foreground">
          {agentCount} steps automated, {humanCount} {humanCount === 1 ? "stays" : "stay"} human
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
        {workflow.rows.map((r) => (
          <div
            key={r.step}
            className="grid grid-cols-[20px_1.1fr_0.9fr_1.5fr_1.2fr] items-center gap-5 border-b border-border py-4 text-[15px] last:border-b-0"
          >
            <Mark agent={Boolean(r.agent)} />
            <span className="font-medium">{r.step}</span>
            <span className="text-muted-foreground">{r.tool}</span>
            <span className={r.agent ? "text-foreground" : "text-muted-foreground"}>
              {r.agent ?? "Stays with a person"}
            </span>
            <span className="text-muted-foreground">{r.check}</span>
          </div>
        ))}
      </div>

      <ol className="md:hidden">
        {workflow.rows.map((r) => (
          <li key={r.step} className="flex gap-3 border-b border-border py-4 last:border-b-0">
            <span className="pt-1.5">
              <Mark agent={Boolean(r.agent)} />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-[15px] font-medium">{r.step}</p>
              <p className="text-sm text-foreground/80">{r.agent ?? "Stays with a person"}</p>
              <p className="text-[13px] text-muted-foreground">
                {r.tool}. {r.check}.
              </p>
            </div>
          </li>
        ))}
      </ol>

      <figcaption className="pt-5 text-[13px] text-muted-foreground">
        Illustrative. Every engagement starts by mapping one of your own processes like this.
      </figcaption>
    </figure>
  );
}

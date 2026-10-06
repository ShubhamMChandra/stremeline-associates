"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@repo/ui";
import { useReducedMotion } from "@repo/animation";

/**
 * What this does: An ops document, written the way a team would write it, marked up by WAM
 * Why it's here: Shows the method instead of describing it. Highlighted phrases are work an agent
 *   can take; margin notes say how it runs and which check stays with a person
 * How it works: While in view, the highlighter draws over one step at a time and its note appears,
 *   then the next document loads, until the visitor picks one. Reduced motion shows it all at once.
 * Dependencies: React state, @repo/ui cn, @repo/animation
 */

type Segment = string | { mark: string };

interface Step {
  text: Segment[];
  note: string;
  check?: string;
  human?: boolean;
}

interface Doc {
  key: string;
  tab: string;
  title: string;
  steps: Step[];
}

const docs: Doc[] = [
  {
    key: "leads",
    tab: "Lead handling",
    title: "New inquiries",
    steps: [
      {
        text: [
          "Every morning, someone ",
          { mark: "checks the website form, the shared inbox, and partner referrals" },
          " for anything that came in overnight, then ",
          { mark: "copies each inquiry into the CRM" },
          ".",
        ],
        note: "Picked up the moment it lands.",
        check: "Anything it can't verify goes to a review queue.",
      },
      {
        text: [
          "For each company, ",
          { mark: "look up its size, industry, and the tools it uses" },
          " and add them to the record.",
        ],
        note: "Filled in automatically.",
        check: "Every source is logged on the record.",
      },
      {
        text: [
          { mark: "Score the lead against our criteria" },
          " and ",
          { mark: "assign it to a rep by territory and deal size" },
          ".",
        ],
        note: "Scored and routed in seconds.",
        check: "Your team owns the criteria. Reps can reassign.",
      },
      {
        text: ["The rep reaches out and has the first conversation."],
        note: "Stays with your rep.",
        human: true,
      },
    ],
  },
  {
    key: "crm",
    tab: "CRM upkeep",
    title: "Keeping the CRM clean",
    steps: [
      {
        text: ["The ops lead decides what a clean record looks like and writes it down."],
        note: "Stays with your ops lead.",
        human: true,
      },
      {
        text: [
          "Once a week, someone ",
          { mark: "goes through new records and fixes names, phone numbers, and company names" },
          ".",
        ],
        note: "Fixed as records are created or changed.",
        check: "Every change is logged and can be undone.",
      },
      {
        text: [{ mark: "Find duplicate contacts and merge them" }, "."],
        note: "Likely duplicates are merged.",
        check: "Uncertain matches wait for approval.",
      },
      {
        text: [{ mark: "Fill in missing fields" }, " from the data sources we've approved."],
        note: "Completed in the background.",
        check: "Only from sources you approve.",
      },
      {
        text: ["If anything looks off, ", { mark: "flag it to the team in Slack" }, "."],
        note: "Posted to a channel as it happens.",
        check: "A person decides what to do.",
      },
    ],
  },
  {
    key: "handoff",
    tab: "Deal handoff",
    title: "When a deal closes",
    steps: [
      {
        text: [
          "When a deal is marked closed-won, the account lead ",
          { mark: "creates the project board and copies over our templates" },
          ".",
        ],
        note: "Set up as soon as the deal closes.",
        check: "Templates stay under your control.",
      },
      {
        text: [{ mark: "Post a summary in the delivery channel" }, " with links back to the deal."],
        note: "Posted with links to the deal.",
        check: "Nothing is sent outside the company.",
      },
      {
        text: ["The account lead runs the kickoff call with the client."],
        note: "Stays with the account lead.",
        human: true,
      },
      {
        text: [{ mark: "Log what was set up" }, " so anyone can check it later."],
        note: "Every action is recorded.",
        check: "Anyone on the team can review it.",
      },
    ],
  },
  {
    key: "report",
    tab: "Monday report",
    title: "The Monday pipeline report",
    steps: [
      {
        text: [
          "Before the Monday meeting, someone ",
          { mark: "pulls the pipeline numbers from Salesforce and HubSpot" },
          ".",
        ],
        note: "Pulled over the weekend.",
        check: "Read-only access.",
      },
      {
        text: [{ mark: "Compare them with last week and note anything that dropped" }, "."],
        note: "Drops past your thresholds are flagged.",
        check: "Your team sets the thresholds.",
      },
      {
        text: [{ mark: "Write a short summary" }, " for leadership."],
        note: "A first draft in plain language.",
        check: "Every number links to its source.",
      },
      {
        text: ["Leadership decides what to do about it."],
        note: "Stays with leadership.",
        human: true,
      },
    ],
  },
];

const STEP_MS = 1700;
const HOLD_MS = 3400;

export function ProcessMarkup() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  const doc = docs[index]!;
  const total = doc.steps.length;
  const playing = !reducedMotion && inView && !hovered;
  const shown = reducedMotion ? total : step;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.3,
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
          if (!pinned) setIndex((i) => (i + 1) % docs.length);
          setStep(0);
        }
      },
      done ? HOLD_MS : step === 0 ? 700 : STEP_MS,
    );
    return () => clearTimeout(t);
  }, [playing, step, total, pinned]);

  function pick(i: number) {
    setIndex(i);
    setStep(reducedMotion ? total : 1);
    setPinned(true);
  }

  return (
    <div ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div
          role="group"
          aria-label="Example process"
          className="-mx-1 flex max-w-full gap-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
        >
          {docs.map((d, i) => (
            <button
              key={d.key}
              type="button"
              aria-pressed={i === index}
              onClick={() => pick(i)}
              className={cn(
                "h-9 shrink-0 rounded-full px-4 text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
                i === index
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
              )}
            >
              {d.tab}
            </button>
          ))}
        </div>
        <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span className="marker is-drawn text-foreground">Highlighted</span>
          means an agent does it.
        </p>
      </div>

      <figure className="m-0 mt-4 rounded-[3px] bg-surface shadow-[0_1px_2px_rgba(14,14,15,0.06),0_24px_48px_-24px_rgba(14,14,15,0.22)]">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 text-[12.5px] text-muted-foreground sm:px-10">
          <span>
            Ops handbook <span aria-hidden="true">/</span> {doc.tab}
          </span>
          <span className="hidden sm:inline">Written by your team. Marked up by WAM.</span>
        </div>

        <div key={doc.key} className="animate-in fade-in-0 px-5 pt-8 pb-10 duration-500 sm:px-10 md:pt-12 md:pb-14">
          <h3 className="font-serif text-[26px] leading-tight font-medium tracking-[-0.01em] md:text-[34px]">
            {doc.title}
          </h3>

          <ol className="mt-8 space-y-7 md:mt-10 md:space-y-8">
            {doc.steps.map((s, i) => {
              const reached = i < shown;
              return (
                <li
                  key={i}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 md:grid-cols-[2rem_minmax(0,1fr)_17rem] md:gap-x-10"
                >
                  <span className="pt-[3px] font-serif text-[17px] text-muted-foreground md:text-[19px]">
                    {i + 1}.
                  </span>
                  <p className="font-serif text-[17px] leading-[1.6] text-foreground md:text-[20px]">
                    {s.text.map((seg, j) =>
                      typeof seg === "string" ? (
                        seg
                      ) : (
                        <span
                          key={j}
                          className={cn("marker", reached && "is-drawn")}
                          style={{ transitionDelay: reached && !reducedMotion ? `${j * 220}ms` : "0ms" }}
                        >
                          {seg.mark}
                        </span>
                      ),
                    )}
                  </p>
                  <aside
                    className={cn(
                      "col-start-2 mt-3 border-l-2 pl-3 text-[13.5px] leading-snug transition-[opacity,transform] duration-500 md:col-start-3 md:mt-1",
                      s.human ? "border-foreground/25" : "border-marker",
                      reached ? "translate-x-0 opacity-100" : "translate-x-1.5 opacity-0",
                    )}
                    style={{ transitionDelay: reached && !reducedMotion ? "380ms" : "0ms" }}
                  >
                    <p className="mb-1 text-[12px] font-medium text-muted-foreground">
                      {s.human ? "Your team" : "Agent"}
                    </p>
                    <p className="text-foreground">{s.note}</p>
                    {s.check && <p className="mt-0.5 text-muted-foreground">{s.check}</p>}
                  </aside>
                </li>
              );
            })}
          </ol>
        </div>
      </figure>
    </div>
  );
}

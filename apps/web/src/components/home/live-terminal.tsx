"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@repo/animation";

/**
 * What this does: A living terminal that types out automation scenarios in real time
 * Why it's here: Replaces generic OrbitingCircles with a demo that SHOWS what the product does
 * How it works: Cycles through scenarios, typing each line with realistic timing using rAF.
 *   Respects prefers-reduced-motion by showing the final state instantly.
 * Dependencies: motion/react, @repo/animation
 */

interface TerminalLine {
  prefix: string;
  text: string;
  type: "command" | "success" | "info" | "result";
  delay: number; // ms before this line appears
}

const scenarios: TerminalLine[][] = [
  [
    { prefix: "$", text: "stremeline deploy --agent lead-router", type: "command", delay: 0 },
    { prefix: "✓", text: "Connected to HubSpot                0.3s", type: "success", delay: 600 },
    { prefix: "✓", text: "Ingesting form submissions     142 leads queued", type: "success", delay: 400 },
    { prefix: "✓", text: "Enrichment via Clearbit         138/142 matched", type: "success", delay: 500 },
    { prefix: "✓", text: "Scoring complete               47 hot · 61 warm · 34 cold", type: "success", delay: 400 },
    { prefix: "✓", text: "Routing to sales team", type: "success", delay: 300 },
    { prefix: " ", text: "  ↳ Sarah C.    12 leads (enterprise)", type: "result", delay: 200 },
    { prefix: " ", text: "  ↳ Marcus T.   18 leads (mid-market)", type: "result", delay: 200 },
    { prefix: " ", text: "", type: "info", delay: 300 },
    { prefix: "→", text: "Agent live. 0 leads dropped. 3m 12s saved per lead.", type: "info", delay: 0 },
  ],
  [
    { prefix: "$", text: "stremeline run --agent crm-hygiene", type: "command", delay: 0 },
    { prefix: "✓", text: "Scanning CRM records             12,847 contacts", type: "success", delay: 500 },
    { prefix: "✓", text: "Duplicates found                 234 → merged", type: "success", delay: 600 },
    { prefix: "✓", text: "Missing fields filled            891 records updated", type: "success", delay: 500 },
    { prefix: "✓", text: "Stale contacts flagged           67 → archived", type: "success", delay: 400 },
    { prefix: " ", text: "", type: "info", delay: 200 },
    { prefix: "→", text: "CRM clean. 1,192 fixes applied. 0 manual effort.", type: "info", delay: 0 },
  ],
  [
    { prefix: "$", text: "stremeline run --agent report-gen --weekly", type: "command", delay: 0 },
    { prefix: "✓", text: "Pulling pipeline data            Salesforce + HubSpot", type: "success", delay: 500 },
    { prefix: "✓", text: "Aggregating metrics              Q4 week 6", type: "success", delay: 400 },
    { prefix: "✓", text: "Formatting report                PDF + Slack summary", type: "success", delay: 500 },
    { prefix: "✓", text: "Delivered to #sales-ops          Mon 8:55 AM", type: "success", delay: 300 },
    { prefix: " ", text: "", type: "info", delay: 200 },
    { prefix: "→", text: "Report delivered. 45 min reclaimed from analyst.", type: "info", delay: 0 },
  ],
];

export function LiveTerminal() {
  const reducedMotion = useReducedMotion();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lines = scenarios[currentScenario] ?? scenarios[0]!;

  const advanceLine = useCallback(() => {
    setVisibleLines((prev) => {
      const next = prev + 1;
      const currentLines = scenarios[currentScenario] ?? scenarios[0]!;
      if (next >= currentLines.length) {
        // All lines shown — pause, then move to next scenario
        timeoutRef.current = setTimeout(() => {
          setCurrentScenario((s) => (s + 1) % scenarios.length);
          setVisibleLines(0);
        }, 3000);
        return next;
      }
      // Schedule next line
      const nextLine = currentLines[next];
      if (nextLine) {
        timeoutRef.current = setTimeout(advanceLine, nextLine.delay);
      }
      return next;
    });
  }, [currentScenario]);

  useEffect(() => {
    if (reducedMotion) {
      // Show all lines immediately
      setVisibleLines(lines.length);
      return;
    }

    // Start typing the first line after a delay
    setVisibleLines(0);
    timeoutRef.current = setTimeout(() => {
      setVisibleLines(1);
      const firstLine = lines[1];
      if (firstLine) {
        timeoutRef.current = setTimeout(advanceLine, firstLine.delay);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentScenario, reducedMotion, lines, advanceLine]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-[#0D0D0F] shadow-2xl">
      {/* Terminal chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/60" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
        <div className="h-3 w-3 rounded-full bg-green-500/60" />
        <span className="ml-3 font-mono text-[11px] text-muted-foreground">
          stremeline-cli
        </span>
      </div>

      {/* Terminal body */}
      <div className="min-h-[260px] p-4 font-mono text-[13px] leading-relaxed lg:min-h-[300px]">
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={`${currentScenario}-${i}`}
            initial={reducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="flex gap-2"
          >
            <span
              className={
                line.type === "command"
                  ? "text-primary"
                  : line.type === "success"
                    ? "text-emerald-400"
                    : line.type === "info"
                      ? "text-primary"
                      : "text-muted-foreground"
              }
            >
              {line.prefix}
            </span>
            <span
              className={
                line.type === "command"
                  ? "text-foreground"
                  : line.type === "info"
                    ? "text-muted-foreground"
                    : "text-muted-foreground/80"
              }
            >
              {line.text}
            </span>
          </motion.div>
        ))}
        {/* Blinking cursor */}
        {visibleLines < lines.length && (
          <span className="mt-1 inline-block h-4 w-2 animate-pulse bg-primary/60" />
        )}
      </div>
    </div>
  );
}

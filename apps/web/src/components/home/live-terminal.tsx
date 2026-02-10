"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * What this does: A living terminal that types out automation scenarios in real time
 * Why it's here: Replaces generic OrbitingCircles with a demo that SHOWS what the product does
 * How it works: Plays the first scenario once — types the command char-by-char with
 *   human-like timing, reveals output lines with staggered delays, then stays static
 *   with a blinking cursor. All timer logic lives in a single useEffect.
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

/* ── Blinking cursor — true on/off like a real terminal ── */
function Cursor() {
  return (
    <span
      className="inline-block h-[15px] w-[7px] translate-y-[3px] bg-primary/80"
      style={{ animation: "terminal-blink 1s step-end infinite" }}
    />
  );
}

export function LiveTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  // -1 = not started/between phases; 0 = cursor visible; 1+ = chars revealed
  const [typedChars, setTypedChars] = useState(-1);

  const lines = scenarios[0]!;
  const commandLine = lines[0]!;
  const isTyping = typedChars >= 0 && visibleLines === 0;
  const allRevealed = visibleLines >= lines.length;

  /*
   * Single effect runs once on mount — plays the first scenario, then stops.
   * Timers are collected and cleared on unmount.
   */
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    let charIdx = 0;
    let lineIdx = 0;
    const scenarioLines = scenarios[0]!;
    const cmd = scenarioLines[0]!;

    /* Phase 1 — type command char-by-char */
    function typeChar() {
      charIdx++;
      setTypedChars(charIdx);

      if (charIdx >= cmd.text.length) {
        timers.push(setTimeout(startOutput, 250));
        return;
      }

      const nextChar = cmd.text[charIdx];
      const baseSpeed = nextChar === " " ? 20 : 32;
      const variance = Math.random() * 38;
      timers.push(setTimeout(typeChar, baseSpeed + variance));
    }

    /* Phase 2 — transition from typing to output */
    function startOutput() {
      setTypedChars(-1);
      lineIdx = 1;
      setVisibleLines(1);
      scheduleNextLine();
    }

    /* Phase 3 — reveal output lines one by one, then stop */
    function scheduleNextLine() {
      if (lineIdx >= scenarioLines.length) return; // done — stay static
      const nextLine = scenarioLines[lineIdx];
      if (nextLine) {
        const jitter = 1 + (Math.random() - 0.5) * 0.3;
        timers.push(setTimeout(showNextLine, nextLine.delay * jitter));
      }
    }

    function showNextLine() {
      lineIdx++;
      setVisibleLines(lineIdx);
      scheduleNextLine();
    }

    // Kick off: show cursor, then start typing
    timers.push(setTimeout(() => {
      setTypedChars(0);
      timers.push(setTimeout(typeChar, 150));
    }, 300));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  /* ── Color helpers ── */
  const prefixColor = (type: TerminalLine["type"]) =>
    type === "command"
      ? "text-primary"
      : type === "success"
        ? "text-emerald-400"
        : type === "info"
          ? "text-primary"
          : "text-muted-foreground";

  const textColor = (type: TerminalLine["type"]) =>
    type === "command"
      ? "text-foreground"
      : type === "info"
        ? "text-muted-foreground"
        : "text-muted-foreground/80";

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-[#0D0D0F] shadow-2xl">
      {/* Terminal chrome — macOS-style traffic lights */}
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
        {/* ── Phase 1: Command being typed character-by-character ── */}
        {isTyping && (
          <div className="flex gap-2">
            <span className="text-primary">{commandLine.prefix}</span>
            <span className="text-foreground">
              {commandLine.text.slice(0, typedChars)}
              <Cursor />
            </span>
          </div>
        )}

        {/* ── Phase 2: Fully revealed lines ── */}
        {lines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            // Skip entrance animation on the command line (already shown via typing)
            initial={i === 0 ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="flex gap-2"
          >
            <span className={prefixColor(line.type)}>{line.prefix}</span>
            <span className={textColor(line.type)}>{line.text}</span>
          </motion.div>
        ))}

        {/* ── Blinking cursor while output lines are streaming in ── */}
        {visibleLines > 0 && !allRevealed && !isTyping && (
          <div className="mt-0.5">
            <Cursor />
          </div>
        )}

        {/* ── "Ready" prompt after all output — terminal feels alive, waiting ── */}
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.2 }}
            className="mt-1 flex gap-2"
          >
            <span className="text-primary">$</span>
            <Cursor />
          </motion.div>
        )}
      </div>
    </div>
  );
}

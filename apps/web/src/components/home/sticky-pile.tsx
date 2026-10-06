"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Logo, cn } from "@repo/ui";
import { useReducedMotion } from "@repo/animation";

/**
 * What this does: A pile of sticky notes with everyday ops chores and a tray that agents work from
 * Why it's here: The one playful object on the homepage. Visitors hand off busywork themselves and
 *   see which chores an agent can take and which ones stay with a person
 * How it works: Notes are draggable with pointer events (touch included) and also respond to a tap
 *   or Enter. Dropping an agent chore in the tray, or letting go once it is 60% of the way there,
 *   folds it into a checked log line; a chore that
 *   needs a person springs back with a short reason. Positions are percentages per breakpoint.
 *   The statement sits in the empty bottom-left corner of the desk on large screens.
 *   Grabbing a note peels it up toward the held corner; it sways while dragged and settles back
 *   onto the page on release.
 * Dependencies: React state, lucide-react, @repo/ui, @repo/animation
 */

interface Chore {
  id: string;
  text: string;
  color: string;
  agent: boolean;
  reply: string;
  wideOnly?: boolean;
  pos: { x: number; y: number; mx: number; my: number; r: number };
}

const chores: Chore[] = [
  {
    id: "crm",
    text: "Copy last night's form fills into the CRM",
    color: "#FFE9A8",
    agent: true,
    reply: "Runs as each form comes in.",
    pos: { x: 17, y: 20, mx: 27, my: 15, r: -5 },
  },
  {
    id: "dana",
    text: "Call Dana about the renewal",
    color: "#F9D3DA",
    agent: false,
    reply: "Keep this one. Dana wants to hear from you.",
    pos: { x: 43, y: 15, mx: 66, my: 13, r: 4 },
  },
  {
    id: "dupes",
    text: "Merge duplicate contacts",
    color: "#CFE6D2",
    agent: true,
    reply: "Merged every week. Unsure matches wait for you.",
    pos: { x: 72, y: 24, mx: 29, my: 48, r: 3 },
  },
  {
    id: "invoices",
    text: "Chase the overdue invoices",
    color: "#CDE3F2",
    agent: true,
    reply: "Reminders drafted for your review.",
    wideOnly: true,
    pos: { x: 27, y: 52, mx: 27, my: 46, r: 3 },
  },
  {
    id: "hire",
    text: "Interview the new ops hire",
    color: "#E3D8F3",
    agent: false,
    reply: "That one's yours.",
    pos: { x: 55, y: 49, mx: 67, my: 46, r: -6 },
  },
  {
    id: "pipeline",
    text: "Pull Monday's pipeline numbers",
    color: "#FBD9BF",
    agent: true,
    reply: "Ready before the meeting.",
    pos: { x: 82, y: 58, mx: 27, my: 81, r: 5 },
  },
  {
    id: "board",
    text: "Set up the project board for the new client",
    color: "#CFE6D2",
    agent: true,
    reply: "Built from your templates when the deal closes.",
    pos: { x: 52, y: 82, mx: 65, my: 80, r: -2 },
  },
  {
    id: "slack",
    text: "Post onboarding updates in Slack",
    color: "#FFE9A8",
    agent: true,
    reply: "Posted as things change.",
    wideOnly: true,
    pos: { x: 79, y: 86, mx: 66, my: 81, r: 6 },
  },
];


type Status = "desk" | "flying" | "done";

interface NoteState {
  dx: number;
  dy: number;
  z: number;
  status: Status;
}

const fresh = (): Record<string, NoteState> =>
  Object.fromEntries(chores.map((c, i) => [c.id, { dx: 0, dy: 0, z: i + 1, status: "desk" }]));

export function StickyPile({ statement }: { statement: ReactNode }) {
  const [notes, setNotes] = useState<Record<string, NoteState>>(fresh);
  const [log, setLog] = useState<string[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [bubble, setBubble] = useState<{ id: string; text: string } | null>(null);
  const [touched, setTouched] = useState(false);
  const [press, setPress] = useState<{ id: string; px: number; py: number } | null>(null);
  const [sway, setSway] = useState(0);
  const [settle, setSettle] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const trayRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef<Record<string, HTMLElement | null>>({});
  const drag = useRef<{
    id: string;
    sx: number;
    sy: number;
    dx: number;
    dy: number;
    moved: boolean;
    from: { x: number; y: number };
    to: { x: number; y: number };
    near: boolean;
  } | null>(null);
  const top = useRef(chores.length);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [wide, setWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const shown = chores.filter((c) => wide || !c.wideOnly);
  const agentTotal = shown.filter((c) => c.agent).length;

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const patch = (id: string, next: Partial<NoteState>) =>
    setNotes((n) => ({ ...n, [id]: { ...n[id]!, ...next } }));

  const inTray = (x: number, y: number) => {
    const r = trayRef.current?.getBoundingClientRect();
    return Boolean(r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);
  };

  const handOff = (id: string) => {
    const chore = chores.find((c) => c.id === id);
    const el = noteRefs.current[id];
    const tray = trayRef.current;
    if (!chore || !el || !tray) return;
    setTouched(true);

    if (!chore.agent) {
      patch(id, { dx: 0, dy: 0 });
      setBubble({ id, text: chore.reply });
      later(() => setBubble((b) => (b?.id === id ? null : b)), 2800);
      return;
    }

    const n = el.getBoundingClientRect();
    const t = tray.getBoundingClientRect();
    const cur = notes[id]!;
    patch(id, {
      dx: cur.dx + (t.left + t.width / 2 - (n.left + n.width / 2)),
      dy: cur.dy + (t.top + 96 - (n.top + n.height / 2)),
      status: "flying",
      z: ++top.current,
    });
    later(() => {
      patch(id, { status: "done" });
      setLog((l) => (l.includes(id) ? l : [...l, id]));
    }, 700);
  };

  const onDown = (id: string) => (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || notes[id]?.status !== "desk") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    setPress({
      id,
      px: Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)),
      py: Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)),
    });
    const cur = notes[id]!;
    const t = trayRef.current?.getBoundingClientRect();
    const from = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    drag.current = {
      id,
      sx: e.clientX,
      sy: e.clientY,
      dx: cur.dx,
      dy: cur.dy,
      moved: false,
      from,
      to: t ? { x: t.left + t.width / 2, y: t.top + t.height / 2 } : from,
      near: false,
    };
    patch(id, { z: ++top.current });
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const mx = e.clientX - d.sx;
    const my = e.clientY - d.sy;
    if (!d.moved && Math.hypot(mx, my) > 6) {
      d.moved = true;
      setDragging(d.id);
    }
    if (d.moved) {
      patch(d.id, { dx: d.dx + mx, dy: d.dy + my });
      // Past 60% of the way to the tray counts as handed off
      const total = Math.hypot(d.to.x - d.from.x, d.to.y - d.from.y) || 1;
      const left = Math.hypot(d.to.x - (d.from.x + mx), d.to.y - (d.from.y + my));
      d.near = 1 - left / total >= 0.6;
      setOver(d.near || inTray(e.clientX, e.clientY));
      const push = Math.max(-9, Math.min(9, e.movementX * 0.7));
      setSway((v) => v * 0.6 + push * 0.4);
    }
  };

  const land = (id: string) => {
    setPress(null);
    setSway(0);
    setSettle(id);
    later(() => setSettle((v) => (v === id ? null : v)), 640);
  };

  const onUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    land(d.id);
    drag.current = null;
    setDragging(null);
    setOver(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!d.moved || d.near || inTray(e.clientX, e.clientY)) {
      handOff(d.id);
      return;
    }
    const desk = deskRef.current?.getBoundingClientRect();
    const outside =
      desk &&
      (e.clientX < desk.left || e.clientX > desk.right || e.clientY < desk.top || e.clientY > desk.bottom);
    if (outside) patch(d.id, { dx: 0, dy: 0 });
  };

  const onCancel = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    land(d.id);
    drag.current = null;
    setDragging(null);
    setOver(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    patch(d.id, { dx: d.dx, dy: d.dy });
  };

  const reset = () => {
    setNotes(fresh());
    setLog([]);
    setBubble(null);
  };

  const done = log.filter((id) => shown.some((c) => c.id === id)).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-center lg:gap-14">
      <div className="relative">
        <div className="lg:absolute lg:bottom-0 lg:left-0 lg:z-0 lg:max-w-[21rem]">{statement}</div>
      <div ref={deskRef} className="relative mt-8 h-[25rem] sm:h-[28rem] lg:mt-0 lg:h-[clamp(32rem,calc(100svh-11rem),44rem)]">
        {shown.map((c, i) => {
          const s = notes[c.id]!;
          if (s.status === "done") return null;
          const lifted = dragging === c.id;
          const flying = s.status === "flying";
          const peel = press?.id === c.id && !reduced ? press : null;
          return (
            <div
              key={c.id}
              className="absolute top-[var(--my)] left-[var(--mx)] md:top-[var(--y)] md:left-[var(--x)]"
              style={
                {
                  "--x": `${c.pos.x}%`,
                  "--y": `${c.pos.y}%`,
                  "--mx": `${c.pos.mx}%`,
                  "--my": `${c.pos.my}%`,
                  zIndex: s.z,
                } as CSSProperties
              }
            >
              <button
                ref={(el) => {
                  noteRefs.current[c.id] = el;
                }}
                type="button"
                onPointerDown={onDown(c.id)}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onCancel}
                onClick={(e) => {
                  if (e.detail === 0) handOff(c.id);
                }}
                aria-label={`${c.text}. ${c.agent ? "Hand off to an agent." : "Try handing it off."}`}
                className="block touch-pan-y select-none md:touch-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground [@media(pointer:fine)]:cursor-grab"
                style={{
                  transform: `translate(calc(-50% + ${s.dx}px), calc(-50% + ${s.dy}px)) rotate(${
                    lifted ? c.pos.r * 0.4 : c.pos.r
                  }deg) scale(${flying ? 0.35 : lifted ? 1.06 : 1})`,
                  opacity: flying ? 0 : 1,
                  transition: lifted
                    ? "transform 70ms ease-out"
                    : flying
                      ? "transform 700ms cubic-bezier(0.45, 0, 0.25, 1), opacity 260ms ease 460ms"
                      : "transform 760ms cubic-bezier(0.34, 1.22, 0.64, 1), opacity 380ms ease",
                }}
              >
                <span
                  className={cn(
                    "relative flex size-[7.5rem] flex-col rounded-[2px] p-3 text-left text-[13.5px] leading-[1.3] font-medium text-[#2B2722] duration-500 sm:size-[8.75rem] sm:p-3.5 sm:text-[15px] lg:size-[10rem] lg:p-4 lg:text-[16px]",
                    bubble?.id === c.id
                      ? "animate-[note-nudge_0.45s_ease-in-out_2]"
                      : flying && !reduced
                        ? "animate-[note-fly_0.7s_ease-in-out]"
                        : settle === c.id && !reduced
                          ? "animate-[note-stick_0.62s_ease-out]"
                          : !touched && "animate-in fade-in-0 zoom-in-95",
                  )}
                  style={{
                    background: c.color,
                    animationDelay: settle === c.id || flying ? "0ms" : `${120 + i * 70}ms`,
                    animationFillMode: "backwards",
                    transform: peel
                      ? `perspective(700px) rotateX(${-peel.py * 11}deg) rotateY(${peel.px * 11}deg) rotate(${
                          lifted ? sway : 0
                        }deg) translateY(-7px) scale(1.035)`
                      : undefined,
                    transition: "transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 320ms ease",
                    boxShadow:
                      peel || lifted
                        ? `${-(peel?.px ?? 0) * 7}px 3px 4px rgba(60,45,10,0.08), ${-(peel?.px ?? 0) * 10}px 30px 40px -18px rgba(60,45,10,0.45)`
                        : "0 1px 1px rgba(60,45,10,0.06), 0 12px 20px -14px rgba(60,45,10,0.4)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[2px] transition-opacity duration-200"
                    style={{
                      opacity: peel ? 1 : 0,
                      background: peel
                        ? `radial-gradient(90% 90% at ${(peel.px + 1) * 50}% ${(peel.py + 1) * 50}%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 38%, rgba(60,45,10,0.07) 100%)`
                        : undefined,
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-7 rounded-t-[2px] bg-gradient-to-b from-black/[0.045] to-transparent"
                  />
                  <span className="relative">{c.text}</span>
                </span>
              </button>
              {bubble?.id === c.id && (
                <span
                  role="status"
                  className="animate-in fade-in-0 absolute top-0 left-0 z-50 w-max max-w-[14rem] -translate-x-1/2 -translate-y-[calc(100%+4.5rem)] rounded-xl sm:-translate-y-[calc(100%+5.1rem)] lg:-translate-y-[calc(100%+5.75rem)] bg-foreground px-3 py-2 text-center text-[13px] leading-snug text-background shadow-lg duration-200"
                >
                  {bubble.text}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[13px] text-muted-foreground md:hidden">
        Tap a note to hand it off. Some come back.
      </p>
      </div>

      <div
        ref={trayRef}
        className={cn(
          "rounded-[1.25rem] bg-[#EBE4CF] p-4 shadow-[inset_0_2px_10px_rgba(60,45,10,0.08)] ring-1 ring-black/[0.05] transition-[box-shadow,background-color,transform] duration-200 sm:p-5",
          over && "scale-[1.015] bg-[#F1E8C4] ring-2 ring-[#E9C93B]",
        )}
      >
        <div className="flex items-center justify-between gap-3 px-1">
          <Logo />
          <span className="text-[13px] text-muted-foreground" aria-live="polite">
            {done} of {agentTotal} handed off
          </span>
        </div>

        <ol className="mt-4 space-y-2">
          {log.map((id) => {
            const c = chores.find((x) => x.id === id)!;
            return (
              <li
                key={id}
                className="animate-in fade-in-0 slide-in-from-top-2 rounded-xl bg-surface px-3.5 py-3 shadow-[0_1px_2px_rgba(60,45,10,0.08)] duration-300"
              >
                <p className="flex items-start gap-2.5 text-[14px] leading-snug font-medium">
                  <span className="mt-px inline-flex size-[18px] shrink-0 items-center justify-center rounded-full bg-marker">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {c.text}
                </p>
                <p className="mt-1 pl-[1.65rem] text-[13px] leading-snug text-muted-foreground">{c.reply}</p>
              </li>
            );
          })}
        </ol>

        {done < agentTotal ? (
          <p
            className={cn(
              "rounded-xl border border-dashed border-foreground/20 px-4 text-center text-[13.5px] text-muted-foreground",
              done ? "mt-2 py-3" : "py-10",
            )}
          >
            {touched ? (
              "Keep going."
            ) : (
              <>
                <span className="md:hidden">Tap a note above.</span>
                <span className="hidden md:inline">Drag a note here, or tap it.</span>
              </>
            )}
          </p>
        ) : (
          <div className="animate-in fade-in-0 mt-4 px-1 duration-500">
            <p className="text-[15px] font-medium">That&apos;s the audit, more or less.</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-full bg-foreground px-4 font-medium text-background transition-colors hover:bg-foreground/85"
              >
                Do it with your real list
              </Link>
              <button
                type="button"
                onClick={reset}
                className="text-muted-foreground underline decoration-foreground/25 underline-offset-4 hover:text-foreground"
              >
                Put them back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

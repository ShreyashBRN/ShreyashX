"use client";

/**
 * Buttons — four independently-stateful animated button interactions:
 * Staggered Letter Lift, Single Liquid Bubble, Magnetic, and Cursor Compression.
 *
 * Every interaction below is driven by real pointer/keyboard state and
 * Framer Motion springs — nothing is a static CSS decoration.
 *
 * Dependencies: framer-motion, tailwindcss
 *
 * Exports:
 *   - AnimatedButton (named) → a single variant. <AnimatedButton variant="magnetic" />
 *   - ButtonsShowcase (default) → the 2x2 / stacked demo grid with all four,
 *                                  each with its name below it.
 */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionStyle,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  utils                                                              */
/* ------------------------------------------------------------------ */

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type ThemeMode = "light" | "dark";

/** Tracks the site's class-based dark-mode toggle (Tailwind darkMode:'class'
 *  on <html>/<body>), falling back to the OS-level media query. */
function useResolvedTheme(theme: ThemeMode | "system" = "system"): ThemeMode {
  const [resolved, setResolved] = useState<ThemeMode>("light");

  useEffect(() => {
    if (theme !== "system") {
      setResolved(theme);
      return;
    }
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const hasDarkClass = () =>
      document.documentElement.classList.contains("dark") || document.body.classList.contains("dark");

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const update = () => setResolved(hasDarkClass() ? "dark" : mq?.matches ? "dark" : "light");

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    mq?.addEventListener("change", update);

    return () => {
      observer.disconnect();
      mq?.removeEventListener("change", update);
    };
  }, [theme]);

  return resolved;
}

/* ------------------------------------------------------------------ */
/*  shared geometry + color tokens                                     */
/* ------------------------------------------------------------------ */

// Every variant shares this exact box so no animation can ever change the
// layout: same width, height, radius, and type scale across all four.
// This is the size that was already dialed in — do not touch it.
const SHELL_SIZE = "w-[min(140px,calc(100vw-40px))] h-[54px]";
const SHELL_TEXT = "text-[20px]";
const SHELL_BASE = cn(
  "group relative inline-flex select-none items-center justify-center overflow-hidden",
  "rounded-full font-bold tracking-wide outline-none",
  "cursor-pointer touch-none",
  "focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/50"
);

interface ThemeColors {
  bg: string;
  text: string;
  liquidCore: string;
  liquidEdge: string;
  liquidStroke: string;
  idleShadow: string;
  hoverShadow: string;
  pressedShadow: string;
  dentShadow: string;
  dentHighlight: string;
}

function colorsFor(theme: ThemeMode): ThemeColors {
  if (theme === "dark") {
    // Button is white/near-white here, so the liquid must read as a
    // translucent DARK/charcoal mass to stay visible against it.
    return {
      bg: "#f4f4f4",
      text: "#0a0a0a",
      liquidCore: "rgba(10,10,10,0.55)",
      liquidEdge: "rgba(10,10,10,0.06)",
      liquidStroke: "rgba(10,10,10,0.34)",
      idleShadow: "0 1px 1px rgba(0,0,0,0.5), 0 12px 28px -14px rgba(0,0,0,0.75)",
      hoverShadow: "0 1px 1px rgba(0,0,0,0.5), 0 18px 34px -14px rgba(0,0,0,0.8)",
      pressedShadow: "0 1px 1px rgba(0,0,0,0.4), 0 3px 6px -3px rgba(0,0,0,0.55)",
      dentShadow: "rgba(0,0,0,0.32)",
      dentHighlight: "rgba(255,255,255,0.5)",
    };
  }
  // Button is black/near-black here, so the liquid must read as a
  // translucent WHITE/milky mass to stay visible against it.
  return {
    bg: "#111111",
    text: "#fafafa",
    liquidCore: "rgba(255,255,255,0.55)",
    liquidEdge: "rgba(255,255,255,0.08)",
    liquidStroke: "rgba(255,255,255,0.32)",
    idleShadow: "0 1px 1px rgba(0,0,0,0.06), 0 12px 24px -12px rgba(0,0,0,0.4)",
    hoverShadow: "0 1px 1px rgba(0,0,0,0.08), 0 18px 32px -12px rgba(0,0,0,0.45)",
    pressedShadow: "0 1px 1px rgba(0,0,0,0.1), 0 3px 6px -4px rgba(0,0,0,0.3)",
    dentShadow: "rgba(0,0,0,0.4)",
    dentHighlight: "rgba(255,255,255,0.35)",
  };
}

/* ------------------------------------------------------------------ */
/*  Variant 1 — Staggered Letter Lift                                   */
/* ------------------------------------------------------------------ */
/* Each character sits in its own 1-line-tall, overflow-hidden window    */
/* that holds TWO stacked copies of the letter. On hover, the inner      */
/* column translates up by exactly half its height (one letter-height), */
/* sliding the visible copy out through the top of its window while its  */
/* twin slides up seamlessly into view underneath. Each letter's motion  */
/* is delayed by its own index, so H moves before E, before the first L, */
/* before the second L, before O — a real one-by-one sequence.           */
/* TIMING: slowed from the previous fast pass — 70ms stagger, 300ms per  */
/* letter — so the sequence reads clearly instead of blurring together.  */

function LetterLiftButton({
  label,
  colors,
  reduceMotion,
  onClick,
  className,
}: {
  label: string;
  colors: ThemeColors;
  reduceMotion: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const letters = Array.from(label);

  const triggerOn = () => setHovered(true);
  const triggerOff = () => setHovered(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={triggerOn}
      onPointerLeave={triggerOff}
      onTouchStart={triggerOn}
      onTouchEnd={triggerOff}
      onFocus={triggerOn}
      onBlur={triggerOff}
      className={cn(SHELL_BASE, SHELL_SIZE, SHELL_TEXT, className)}
      style={{ backgroundColor: colors.bg, color: colors.text, boxShadow: colors.idleShadow }}
    >
      <span className="relative z-10 flex leading-none">
        {letters.map((ch, i) => (
          <span key={i} className="relative block h-[1.1em] overflow-hidden">
            <motion.span
              className="flex flex-col"
              animate={{ y: hovered ? "-50%" : "0%" }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.3,
                      delay: i * 0.040,
                      ease: [0.16, 1, 0.3, 1],
                    }
              }
            >
              <span>{ch === " " ? "\u00A0" : ch}</span>
              <span>{ch === " " ? "\u00A0" : ch}</span>
            </motion.span>
          </span>
        ))}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant 2 — Single Liquid Bubble (one continuous fluid)            */
/* ------------------------------------------------------------------ */
/* This is ONE pill-shaped fluid mass, the same height as the button,   */
/* that grows across the button from whichever half the pointer entered,*/
/* reaches the opposite edge (full coverage), then shrinks away in the  */
/* SAME direction it grew (leading edge stays put, trailing edge        */
/* retreats). It is driven by a tiny state machine — idle → grow →      */
/* shrink → idle — with an actual "reach full coverage" hold, not a     */
/* single 0%→100%→0% tween, so growth visibly stops before it reverses. */
/*                                                                       */
/* Geometry: the fluid <span> is pinned to whichever edge is its current */
/* anchor (left:0 or right:0) and its WIDTH is animated with a plain CSS */
/* transition. Because both edges of a full-width (100%) box sit in the  */
/* same place, flipping the anchor at that exact instant (grow → shrink) */
/* causes no visual jump — it just changes which edge the next width     */
/* transition holds fixed, which is exactly what "grow one way, shrink   */
/* the same way" requires. rounded-full on both the fluid and its parent */
/* keeps the leading edge round and the anchored edge flush/seamless.    */

type FluidPhase = "idle" | "grow" | "shrink";
type FluidSide = "left" | "right";

const FLUID_DURATION_MS = 500;
const FLUID_HOLD_MS = 10;

function LiquidBubbleButton({
  label,
  colors,
  reduceMotion,
  onClick,
  className,
}: {
  label: string;
  colors: ThemeColors;
  reduceMotion: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const [side, setSide] = useState<FluidSide>("left");
  const [phase, setPhase] = useState<FluidPhase>("idle");
  const [instant, setInstant] = useState(false);

  const runningRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sideFromClientX = useCallback((clientX: number, rect: DOMRect): FluidSide => {
    return clientX - rect.left < rect.width / 2 ? "left" : "right";
  }, []);

  const start = useCallback(
    (newSide: FluidSide) => {
      if (reduceMotion || runningRef.current) return;
      runningRef.current = true;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

      // Step 1: snap the fluid to zero width, anchored at the new origin
      // edge, with transitions disabled — no visible flash/jump.
      setSide(newSide);
      setInstant(true);
      setPhase("grow");

      // Step 2: on the next two frames, re-enable the transition so the
      // very next width change (0% -> 100%) actually animates.
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setInstant(false);
        });
      });
    },
    [reduceMotion]
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (reduceMotion || e.pointerType === "touch") return;
      const rect = e.currentTarget.getBoundingClientRect();
      start(sideFromClientX(e.clientX, rect));
    },
    [reduceMotion, sideFromClientX, start]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      if (reduceMotion) return;
      const t = e.touches[0];
      if (!t) return;
      const rect = e.currentTarget.getBoundingClientRect();
      start(sideFromClientX(t.clientX, rect));
    },
    [reduceMotion, sideFromClientX, start]
  );

  // Fires when the WIDTH transition on the fluid span completes.
  const handleFluidTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLSpanElement>) => {
      if (e.propertyName !== "width") return;

      if (phase === "grow") {
        // Full coverage reached — hold briefly so it visibly "stops"
        // before reversing, then begin the shrink in the same direction.
        holdTimerRef.current = setTimeout(() => {
          setPhase("shrink");
        }, FLUID_HOLD_MS);
      } else if (phase === "shrink") {
        setPhase("idle");
        runningRef.current = false;
      }
    },
    [phase]
  );

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  // grow: anchored at the origin side, width animates 0% -> 100%.
  // shrink: anchored at the OPPOSITE side (the edge that just reached full
  // coverage stays put), width animates 100% -> 0%, i.e. the fluid
  // retreats in the same direction it grew.
  const anchorLeft = phase === "shrink" ? side === "right" : side === "left";
  const widthPct = phase === "grow" && !instant ? 100 : 0;

  const fluidStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: anchorLeft ? 0 : "auto",
    right: anchorLeft ? "auto" : 0,
    width: `${widthPct}%`,
    borderRadius: 9999,
    background: `radial-gradient(130% 160% at ${anchorLeft ? "28%" : "72%"} 38%, ${colors.liquidCore}, ${colors.liquidEdge})`,
    boxShadow: `inset 0 0 0 1px ${colors.liquidStroke}`,
    transitionProperty: "width",
    transitionDuration: instant ? "0ms" : `${FLUID_DURATION_MS}ms`,
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onTouchStart={handleTouchStart}
      className={cn(SHELL_BASE, SHELL_SIZE, SHELL_TEXT, className)}
      style={{ backgroundColor: colors.bg, color: colors.text, boxShadow: colors.idleShadow }}
    >
      {!reduceMotion && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
        >
          <span style={fluidStyle} onTransitionEnd={handleFluidTransitionEnd} />
        </span>
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant 3 — Magnetic                                                */
/* ------------------------------------------------------------------ */
/* UNCHANGED — working, do not modify.                                  */

function MagneticButton({
  label,
  colors,
  reduceMotion,
  onClick,
  className,
}: {
  label: string;
  colors: ThemeColors;
  reduceMotion: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.5 });
  const [rotate, setRotate] = useState(0);

  const MAX_OFFSET = 11;
  const PULL = 0.42;

  useEffect(() => {
    const unsub = springX.on("change", (v) => setRotate((v / MAX_OFFSET) * 3));
    return unsub;
  }, [springX]);

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (reduceMotion || e.pointerType === "touch") return;
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relX * PULL)));
      y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relY * PULL)));
    },
    [reduceMotion, x, y]
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const motionStyle: MotionStyle = {
    backgroundColor: colors.bg,
    color: colors.text,
    boxShadow: colors.idleShadow,
    x: springX,
    y: springY,
    rotate: reduceMotion ? 0 : rotate,
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(SHELL_BASE, SHELL_SIZE, SHELL_TEXT, className)}
      style={motionStyle}
    >
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant 4 — Cursor Compression                                      */
/* ------------------------------------------------------------------ */
/* UNCHANGED — working, do not modify.                                  */

const COMPRESSION_MAX_PUSH_RATIO = 0.34; // relative to button height
const COMPRESSION_SIGMA_RATIO = 0.85; // relative to button height

function buildPillOutline(w: number, h: number) {
  const r = h / 2;
  const straight = Math.max(w - h, 0);
  const N_STRAIGHT = 12;
  const N_ARC = 22;
  const pts: { x: number; y: number; nx: number; ny: number }[] = [];

  for (let i = 0; i < N_STRAIGHT; i++) {
    const t = i / N_STRAIGHT;
    pts.push({ x: r + straight * t, y: 0, nx: 0, ny: 1 });
  }
  const cRx = w - r;
  const cRy = r;
  for (let i = 0; i <= N_ARC; i++) {
    const a = -Math.PI / 2 + Math.PI * (i / N_ARC);
    pts.push({
      x: cRx + r * Math.cos(a),
      y: cRy + r * Math.sin(a),
      nx: -Math.cos(a),
      ny: -Math.sin(a),
    });
  }
  for (let i = 0; i < N_STRAIGHT; i++) {
    const t = i / N_STRAIGHT;
    pts.push({ x: w - r - straight * t, y: h, nx: 0, ny: -1 });
  }
  const cLx = r;
  const cLy = r;
  for (let i = 0; i <= N_ARC; i++) {
    const a = Math.PI / 2 + Math.PI * (i / N_ARC);
    pts.push({
      x: cLx + r * Math.cos(a),
      y: cLy + r * Math.sin(a),
      nx: -Math.cos(a),
      ny: -Math.sin(a),
    });
  }
  return pts;
}

function CursorCompressionButton({
  label,
  colors,
  reduceMotion,
  onClick,
  className,
}: {
  label: string;
  colors: ThemeColors;
  reduceMotion: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const shellRef = useRef<HTMLButtonElement>(null);
  const outlineRef = useRef(buildPillOutline(140, 54));
  const sizeRef = useRef({ w: 140, h: 54 });

  const px = useMotionValue(70);
  const py = useMotionValue(27);
  const springPx = useSpring(px, { stiffness: 320, damping: 30, mass: 0.4 });
  const springPy = useSpring(py, { stiffness: 320, damping: 30, mass: 0.4 });
  const amt = useMotionValue(0);
  const springAmt = useSpring(amt, { stiffness: 260, damping: 24 });

  const [engaged, setEngaged] = useState(false);
  const [frame, setFrame] = useState({ clip: "none" as string, cx: 70, cy: 27, o: 0 });

  const rafRef = useRef<number | null>(null);
  const disengageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = shellRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      if (rect.width > 4 && rect.height > 4) {
        sizeRef.current = { w: rect.width, h: rect.height };
        outlineRef.current = buildPillOutline(rect.width, rect.height);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    if (!engaged) return;

    const tick = () => {
      const { w, h } = sizeRef.current;
      const cx = springPx.get();
      const cy = springPy.get();
      const a = springAmt.get();

      if (a < 0.015) {
        setFrame({ clip: "none", cx, cy, o: 0 });
      } else {
        const maxPush = h * COMPRESSION_MAX_PUSH_RATIO;
        const sigma = h * COMPRESSION_SIGMA_RATIO;
        const pts = outlineRef.current;
        let d = "";
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist2 = dx * dx + dy * dy;
          const falloff = Math.exp(-dist2 / (2 * sigma * sigma));
          const push = maxPush * falloff * a;
          const x = p.x + p.nx * push;
          const y = p.y + p.ny * push;
          d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1) + " ";
        }
        d += "Z";
        setFrame({ clip: `path('${d}')`, cx, cy, o: Math.min(1, a * 1.3) });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [engaged, reduceMotion, springPx, springPy, springAmt]);

  const engage = useCallback(
    (clientX: number, clientY: number) => {
      const rect = shellRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (disengageTimer.current) {
        clearTimeout(disengageTimer.current);
        disengageTimer.current = null;
      }
      px.set(clientX - rect.left);
      py.set(clientY - rect.top);
      amt.set(1);
      setEngaged(true);
    },
    [px, py, amt]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (reduceMotion || e.pointerType === "touch") return;
      engage(e.clientX, e.clientY);
    },
    [reduceMotion, engage]
  );

  const release = useCallback(() => {
    amt.set(0);
    if (disengageTimer.current) clearTimeout(disengageTimer.current);
    disengageTimer.current = setTimeout(() => setEngaged(false), 500);
  }, [amt]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      if (reduceMotion) return;
      const t = e.touches[0];
      if (t) engage(t.clientX, t.clientY);
    },
    [reduceMotion, engage]
  );

  return (
    <button
      ref={shellRef}
      type="button"
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={release}
      onTouchStart={handleTouchStart}
      onTouchEnd={release}
      onTouchCancel={release}
      className={cn(SHELL_BASE, SHELL_SIZE, SHELL_TEXT, className)}
      style={{ boxShadow: colors.idleShadow }}
    >
      {/* Deformable surface: the only element whose silhouette moves. */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundColor: colors.bg,
          clipPath: reduceMotion ? undefined : frame.clip,
        }}
      />
      {/* Concave shading riding on the same point — sells the gel dent. */}
      {!reduceMotion && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: frame.o,
            background: `radial-gradient(circle at ${frame.cx}px ${frame.cy}px, ${colors.dentShadow}, transparent 62%), radial-gradient(circle at ${frame.cx - 4}px ${frame.cy - 5}px, ${colors.dentHighlight}, transparent 30%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
      <span className="relative z-10" style={{ color: colors.text }}>
        {label}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Public API                                                          */
/* ------------------------------------------------------------------ */

export type ButtonVariant = "letters" | "liquid" | "magnetic" | "compression";

export interface AnimatedButtonProps {
  /** Which single interaction to render. */
  variant: ButtonVariant;
  /** Button label. Defaults to "HELLO". */
  label?: string;
  /** Called on click/activation. */
  onClick?: () => void;
  /** Force a theme instead of following the site's toggle. */
  theme?: ThemeMode | "system";
  /** Extra classes on the outermost element. */
  className?: string;
}

export function AnimatedButton({
  variant,
  label = "Book a call",
  onClick,
  theme = "system",
  className,
}: AnimatedButtonProps) {
  const resolvedTheme = useResolvedTheme(theme);
  const colors = colorsFor(resolvedTheme);
  const reduceMotion = useReducedMotion() ?? false;

  switch (variant) {
    case "letters":
      return (
        <LetterLiftButton label={label} colors={colors} reduceMotion={reduceMotion} onClick={onClick} className={className} />
      );
    case "liquid":
      return (
        <LiquidBubbleButton label={label} colors={colors} reduceMotion={reduceMotion} onClick={onClick} className={className} />
      );
    case "magnetic":
      return (
        <MagneticButton label={label} colors={colors} reduceMotion={reduceMotion} onClick={onClick} className={className} />
      );
    case "compression":
    default:
      return (
        <CursorCompressionButton label={label} colors={colors} reduceMotion={reduceMotion} onClick={onClick} className={className} />
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Demo showcase                                                       */
/* ------------------------------------------------------------------ */

const VARIANTS: Array<{ variant: ButtonVariant; name: string }> = [
  { variant: "letters", name: "Staggered Letter Lift" },
  { variant: "liquid", name: "Single Liquid Bubble" },
  { variant: "magnetic", name: "Magnetic" },
  { variant: "compression", name: "Cursor Compression" },
];

export default function ButtonsShowcase() {
  return (
    <div className="grid w-full grid-cols-1 place-items-center gap-y-14 gap-x-[90px] sm:grid-cols-2 sm:gap-y-[100px]">
      {VARIANTS.map(({ variant, name }) => (
        <div key={variant} className="flex flex-col items-center gap-4">
          <AnimatedButton variant={variant} />
          <span className="text-sm text-neutral-500 dark:text-neutral-400">{name}</span>
        </div>
      ))}
    </div>
  );
}

export { ButtonsShowcase as Buttons };
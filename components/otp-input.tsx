"use client";

/**
 * OtpInput — four OTP variants (classic squares, underline, connected
 * capsule, filled tiles) with a spring-driven active indicator that
 * travels between slots using measured positions (no hard-coded pixels).
 *
 * Dependencies: framer-motion, lucide-react (demo shell only), tailwindcss
 *
 * Exports:
 *   - OtpInput   (named)  → <OtpInput variant="classic" /> renders one
 *                           functional OTP. <OtpInput /> (no variant)
 *                           renders all four, each with independent state.
 *   - OtpShowcase (default) → demo shell (background, theme toggle,
 *                              2x2 / 1-col responsive grid).
 */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useSpring } from "framer-motion";
import { Moon, Sun } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  utils                                                              */
/* ------------------------------------------------------------------ */

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type ThemeMode = "light" | "dark";
// type OtpVariant = "classic" | "underline" | "pill" | "filled";
export type OtpVariant = "classic" | "underline" | "pill" | "filled";

function useResolvedTheme(theme: ThemeMode | "system" = "system"): ThemeMode {
  const [resolved, setResolved] = useState<ThemeMode>("light");

  useEffect(() => {
    if (theme !== "system") {
      setResolved(theme);
      return;
    }
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Most sites toggle dark mode by adding/removing a "dark" class on
    // <html> or <body> (Tailwind's darkMode: 'class' strategy) rather than
    // relying on the OS-level prefers-color-scheme media query. Detect
    // that first, and keep watching it — falling back to the media query
    // only if no such class is ever present.
    const hasDarkClass = () =>
      document.documentElement.classList.contains("dark") || document.body.classList.contains("dark");

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");

    const update = () => {
      setResolved(hasDarkClass() ? "dark" : mq?.matches ? "dark" : "light");
    };

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
/*  active-indicator position tracker                                  */
/* ------------------------------------------------------------------ */

interface IndicatorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const SPRING = { stiffness: 420, damping: 38, mass: 0.7 } as const;

function defaultTransform(slot: DOMRect, container: DOMRect): IndicatorRect {
  return {
    left: slot.left - container.left,
    top: slot.top - container.top,
    width: slot.width,
    height: slot.height,
  };
}

function useIndicatorTracker(opts: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  getSlotEl: (index: number) => HTMLElement | null;
  activeIndex: number;
  length: number;
  transform?: (slot: DOMRect, container: DOMRect) => IndicatorRect;
}) {
  const { containerRef, getSlotEl, activeIndex, length, transform } = opts;

  const left = useSpring(0, SPRING);
  const top = useSpring(0, SPRING);
  const width = useSpring(0, SPRING);
  const height = useSpring(0, SPRING);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const slotEl = getSlotEl(activeIndex);
    if (!container || !slotEl) return;
    const c = container.getBoundingClientRect();
    const s = slotEl.getBoundingClientRect();
    const rect = (transform ?? defaultTransform)(s, c);
    left.set(rect.left);
    top.set(rect.top);
    width.set(rect.width);
    height.set(rect.height);
  }, [containerRef, getSlotEl, activeIndex, transform, left, top, width, height]);

  // Re-measure whenever the active slot changes — this drives the travel.
  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, length]);

  // Keep the indicator glued to the right spot across resizes.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [measure]);

  return { left, top, width, height };
}

/* ------------------------------------------------------------------ */
/*  visual tokens                                                      */
/* ------------------------------------------------------------------ */

// Solid fill — used ONLY by the filled-tile variant (Variant 4), which is
// meant to look like a solid accent tile when active.
function accentFill(theme: ThemeMode): React.CSSProperties {
  return theme === "dark"
    ? {
        background: "linear-gradient(155deg, #a78bfa 0%, #7c3aed 50%, #5b21b6 100%)",
        boxShadow:
          "0 4px 12px -6px rgba(124,58,237,0.5), 0 0 0 1px rgba(255,255,255,0.08) inset",
      }
    : {
        background: "linear-gradient(155deg, #9b8cf2 0%, #6d4cec 50%, #5432d6 100%)",
        boxShadow:
          "0 4px 10px -6px rgba(84,50,214,0.3), 0 0 0 1px rgba(255,255,255,0.30) inset",
      };
}

// Border-only "focused input" treatment — used by the square slot variant
// (Variant 1). The interior stays transparent so the slot's own light
// background shows through; a single clean border indicates focus (no
// secondary ring/glow/halo).
function accentBorder(theme: ThemeMode): React.CSSProperties {
  return theme === "dark"
    ? { background: "transparent", border: "2px solid #a78bfa" }
    : { background: "transparent", border: "2px solid #7c5cf0" };
}

// Light tint — used by the capsule segment (Variant 3): a subtle highlight
// inside the capsule, not a solid block.
function accentTint(theme: ThemeMode): React.CSSProperties {
  return theme === "dark"
    ? { background: "rgba(167,139,250,0.20)", boxShadow: "0 0 0 1px rgba(167,139,250,0.35) inset" }
    : { background: "rgba(124,92,240,0.14)", boxShadow: "0 0 0 1px rgba(124,92,240,0.30) inset" };
}

function accentTextColor(theme: ThemeMode) {
  return theme === "dark" ? "#c4b5fd" : "#6d4cec";
}

function slotStyle(theme: ThemeMode, tinted: boolean): React.CSSProperties {
  if (theme === "dark") {
    // Dark mode: transparent interior for every variant, white/off-white
    // border and digit color — no gray fill boxes.
    return {
      background: "transparent",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "rgba(255,255,255,0.30)",
      color: "#f5f5f7",
    };
  }
  return tinted
    ? {
        background: "rgba(124,92,240,0.06)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "rgba(124,92,240,0.18)",
        color: "#241b3d",
      }
    : {
        background: "rgba(255,255,255,0.6)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "rgba(15,23,42,0.12)",
        color: "#241b3d",
      };
}

function pillContainerStyle(theme: ThemeMode): React.CSSProperties {
  return theme === "dark"
    ? { background: "transparent", border: "1px solid rgba(255,255,255,0.30)" }
    : { background: "rgba(255,255,255,0.65)", border: "1px solid rgba(15,23,42,0.12)" };
}

function dividerColor(theme: ThemeMode) {
  return theme === "dark" ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.08)";
}

function underlineColor(theme: ThemeMode, active: boolean) {
  if (theme === "dark") return active ? "#b7a7ff" : "rgba(255,255,255,0.18)";
  return active ? "#7c5cf0" : "rgba(91,52,214,0.20)";
}

/* ------------------------------------------------------------------ */
/*  shared slot input                                                   */
/* ------------------------------------------------------------------ */

interface SlotInputProps {
  index: number;
  length: number;
  digits: string[];
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onFocusSlot: (i: number) => void;
  onChangeDigit: (i: number, raw: string) => void;
  onKeyDownSlot: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPasteSlot: (i: number, e: React.ClipboardEvent<HTMLInputElement>) => void;
  setRef: (i: number, el: HTMLInputElement | null) => void;
}

function SlotInput({
  index,
  length,
  digits,
  disabled,
  className,
  style,
  onFocusSlot,
  onChangeDigit,
  onKeyDownSlot,
  onPasteSlot,
  setRef,
}: SlotInputProps) {
  return (
    <input
      ref={(el) => setRef(index, el)}
      value={digits[index] ?? ""}
      disabled={disabled}
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="one-time-code"
      maxLength={length}
      aria-label={`Digit ${index + 1} of ${length}`}
      className={className}
      style={style}
      onFocus={(e) => {
        onFocusSlot(index);
        e.currentTarget.select();
      }}
      onClick={() => onFocusSlot(index)}
      onChange={(e) => onChangeDigit(index, e.target.value)}
      onKeyDown={(e) => onKeyDownSlot(index, e)}
      onPaste={(e) => onPasteSlot(index, e)}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  shared sizing tokens                                                */
/* ------------------------------------------------------------------ */

// All four variants share this exact width so they align to the same left
// and right boundaries, regardless of whether their internal slots have
// gaps between them (classic/underline/filled) or are contiguous (capsule).
const OTP_MAX_WIDTH = "w-full max-w-[336px]";
const SLOT_HEIGHT = "h-[clamp(28px,9vw,40px)]";
const GAP = "gap-[clamp(6px,1.8vw,12px)]";
const FONT_SIZE = "text-[clamp(15px,3.6vw,18px)]";

/* ------------------------------------------------------------------ */
/*  core (single, fully functional variant)                            */
/* ------------------------------------------------------------------ */

interface OtpCoreProps {
  length: number;
  variant: OtpVariant;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  themeMode: ThemeMode;
}

function OtpCore({
  length,
  variant,
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = false,
  themeMode,
}: OtpCoreProps) {
  const isControlled = value !== undefined;

  const [innerDigits, setInnerDigits] = useState<string[]>(() =>
    Array.from({ length }, (_, i) => value?.[i] ?? "")
  );

  const digits = isControlled
    ? Array.from({ length }, (_, i) => value?.[i] ?? "")
    : innerDigits;

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setRef = useCallback((i: number, el: HTMLInputElement | null) => {
    inputRefs.current[i] = el;
  }, []);

  const commit = useCallback(
    (next: string[]) => {
      if (!isControlled) setInnerDigits(next);
      const joined = next.join("");
      onChange?.(joined);
      if (next.every(Boolean) && joined.length === length) {
        onComplete?.(joined);
      }
    },
    [isControlled, onChange, onComplete, length]
  );

  const focusAt = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(length - 1, idx));
      inputRefs.current[clamped]?.focus();
    },
    [length]
  );

  const handleChange = useCallback(
    (idx: number, raw: string) => {
      const clean = raw.replace(/\D/g, "");
      if (!clean) {
        const next = [...digits];
        next[idx] = "";
        commit(next);
        return;
      }
      if (clean.length === 1) {
        const next = [...digits];
        next[idx] = clean;
        commit(next);
        focusAt(idx + 1);
        return;
      }
      const chars = clean.split("");
      const next = [...digits];
      let cursor = idx;
      for (const ch of chars) {
        if (cursor >= length) break;
        next[cursor] = ch;
        cursor++;
      }
      commit(next);
      focusAt(Math.min(cursor, length - 1));
    },
    [digits, commit, focusAt, length]
  );

  const handlePaste = useCallback(
    (idx: number, e: React.ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData("text").replace(/\D/g, "");
      if (!text) return;
      e.preventDefault();
      const chars = text.split("").slice(0, length);
      const next = Array.from({ length }, (_, i) => chars[i] ?? digits[i] ?? "");
      commit(next);
      const lastIndex = Math.min(chars.length, length) - 1;
      focusAt(lastIndex < 0 ? idx : lastIndex);
    },
    [digits, commit, focusAt, length]
  );

  const handleKeyDown = useCallback(
    (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (digits[idx]) {
          const next = [...digits];
          next[idx] = "";
          commit(next);
        } else if (idx > 0) {
          const next = [...digits];
          next[idx - 1] = "";
          commit(next);
          focusAt(idx - 1);
        }
      } else if (e.key === "Delete") {
        e.preventDefault();
        const next = [...digits];
        next[idx] = "";
        commit(next);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusAt(idx - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        focusAt(idx + 1);
      }
    },
    [digits, commit, focusAt]
  );

  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 40);
    return () => clearTimeout(t);
  }, [autoFocus]);

  const getSlotEl = useCallback((i: number) => inputRefs.current[i], []);

  // Underline: thin horizontal bar, same width as the inactive lines,
  // sitting exactly where the inactive line sits — never a blob/dot.
  const underlineTransform = useCallback((slot: DOMRect, container: DOMRect): IndicatorRect => {
    const w = slot.width * 0.78;
    const h = 3;
    return {
      left: slot.left - container.left + (slot.width - w) / 2,
      top: slot.bottom - container.top - h,
      width: w,
      height: h,
    };
  }, []);

  // Capsule segment: inset within the segment, small radius on internal
  // edges — but on the segment touching the capsule's rounded end, that
  // edge inherits the capsule's own full rounding instead of a square-ish
  // corner, so the highlight reads as "part of the pill", not a rectangle
  // dropped inside one.
  const pillTransform = useCallback((slot: DOMRect, container: DOMRect): IndicatorRect => {
    const pad = 3;
    return {
      left: slot.left - container.left + pad,
      top: slot.top - container.top + pad,
      width: slot.width - pad * 2,
      height: slot.height - pad * 2,
    };
  }, []);

  const pillIndicatorRadius = useCallback(
    (index: number): React.CSSProperties => {
      const small = 8;
      const full = 999;
      if (index === 0) {
        return {
          borderTopLeftRadius: full,
          borderBottomLeftRadius: full,
          borderTopRightRadius: small,
          borderBottomRightRadius: small,
        };
      }
      if (index === length - 1) {
        return {
          borderTopLeftRadius: small,
          borderBottomLeftRadius: small,
          borderTopRightRadius: full,
          borderBottomRightRadius: full,
        };
      }
      return {
        borderTopLeftRadius: small,
        borderBottomLeftRadius: small,
        borderTopRightRadius: small,
        borderBottomRightRadius: small,
      };
    },
    [length]
  );

  const indicator = useIndicatorTracker({
    containerRef,
    getSlotEl,
    activeIndex,
    length,
    transform:
      variant === "underline" ? underlineTransform : variant === "pill" ? pillTransform : undefined,
  });

  const indicatorBaseStyle: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
  };

  const commonInputBase =
    "flex-1 min-w-0 rounded-lg text-center font-normal tracking-normal outline-none appearance-none transition-colors duration-200 relative z-10 caret-current disabled:opacity-40";

  /* -------------------------- CLASSIC (square slots) -------------------------- */
  if (variant === "classic") {
    return (
      <div ref={containerRef} className={cn("relative flex", OTP_MAX_WIDTH, GAP)}>
        <motion.div
          className="rounded-lg"
          style={{
            ...indicatorBaseStyle,
            ...accentBorder(themeMode),
            left: indicator.left,
            top: indicator.top,
            width: indicator.width,
            height: indicator.height,
            zIndex: 5,
          }}
        />
        {Array.from({ length }).map((_, i) => {
          const active = i === activeIndex;
          const base = slotStyle(themeMode, false);
          return (
            <SlotInput
              key={i}
              index={i}
              length={length}
              digits={digits}
              disabled={disabled}
              setRef={setRef}
              onFocusSlot={setActiveIndex}
              onChangeDigit={handleChange}
              onKeyDownSlot={handleKeyDown}
              onPasteSlot={handlePaste}
              className={cn(commonInputBase, SLOT_HEIGHT, FONT_SIZE)}
              style={{
                ...base,
                // Interior stays light/transparent-ish in both states — the
                // indicator above supplies the purple border, not a fill.
                borderColor: active ? "transparent" : base.borderColor,
              }}
            />
          );
        })}
      </div>
    );
  }

  /* -------------------------- UNDERLINE -------------------------- */
  if (variant === "underline") {
    return (
      <div ref={containerRef} className={cn("relative flex", OTP_MAX_WIDTH, GAP)}>
        <motion.div
          className="rounded-full"
          style={{
            ...indicatorBaseStyle,
            left: indicator.left,
            top: indicator.top,
            width: indicator.width,
            height: indicator.height,
            background: underlineColor(themeMode, true),
            boxShadow:
              themeMode === "dark"
                ? "0 0 8px rgba(183,167,255,0.55)"
                : "0 0 6px rgba(124,92,240,0.35)",
            zIndex: 5,
          }}
        />
        {Array.from({ length }).map((_, i) => {
          const active = i === activeIndex;
          return (
            <div key={i} className={cn("relative flex flex-1 min-w-0 flex-col items-center", SLOT_HEIGHT)}>
              <SlotInput
                index={i}
                length={length}
                digits={digits}
                disabled={disabled}
                setRef={setRef}
                onFocusSlot={setActiveIndex}
                onChangeDigit={handleChange}
                onKeyDownSlot={handleKeyDown}
                onPasteSlot={handlePaste}
                className={cn(
                  "w-full h-full bg-transparent text-center font-normal tracking-normal outline-none appearance-none transition-colors duration-200 relative z-10 pb-2 disabled:opacity-40",
                  FONT_SIZE
                )}
                style={{ color: active ? underlineColor(themeMode, true) : slotStyle(themeMode, false).color }}
              />
              <span
                className="absolute bottom-0 h-[2px] w-[78%] rounded-full transition-colors duration-200"
                style={{ background: underlineColor(themeMode, false) }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  /* -------------------------- CONNECTED CAPSULE -------------------------- */
  if (variant === "pill") {
    return (
      <div
        ref={containerRef}
        className={cn("relative flex rounded-full p-1", OTP_MAX_WIDTH)}
        style={pillContainerStyle(themeMode)}
      >
        <motion.div
          style={{
            ...indicatorBaseStyle,
            ...accentTint(themeMode),
            ...pillIndicatorRadius(activeIndex),
            left: indicator.left,
            top: indicator.top,
            width: indicator.width,
            height: indicator.height,
            transition: "border-radius 200ms ease",
            zIndex: 5,
          }}
        />
        {Array.from({ length }).map((_, i) => {
          const active = i === activeIndex;
          return (
            <div
              key={i}
              className={cn(SLOT_HEIGHT, "relative flex flex-1 min-w-0 items-center justify-center")}
              style={i < length - 1 ? { borderRight: `1px solid ${dividerColor(themeMode)}` } : undefined}
            >
              <SlotInput
                index={i}
                length={length}
                digits={digits}
                disabled={disabled}
                setRef={setRef}
                onFocusSlot={setActiveIndex}
                onChangeDigit={handleChange}
                onKeyDownSlot={handleKeyDown}
                onPasteSlot={handlePaste}
                className={cn(
                  "w-full h-full bg-transparent text-center font-normal tracking-normal outline-none appearance-none transition-colors duration-200 relative z-10 disabled:opacity-40",
                  FONT_SIZE
                )}
                style={{
                  color: active ? accentTextColor(themeMode) : themeMode === "dark" ? "#f5f5f7" : "#241b3d",
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  /* -------------------------- FILLED TILES -------------------------- */
  return (
    <div ref={containerRef} className={cn("relative flex", OTP_MAX_WIDTH, GAP)}>
      <motion.div
        className="rounded-lg"
        style={{
          ...indicatorBaseStyle,
          ...accentFill(themeMode),
          left: indicator.left,
          top: indicator.top,
          width: indicator.width,
          height: indicator.height,
          zIndex: 5,
        }}
      />
      {Array.from({ length }).map((_, i) => {
        const active = i === activeIndex;
        const base = slotStyle(themeMode, true);
        return (
          <SlotInput
            key={i}
            index={i}
            length={length}
            digits={digits}
            disabled={disabled}
            setRef={setRef}
            onFocusSlot={setActiveIndex}
            onChangeDigit={handleChange}
            onKeyDownSlot={handleKeyDown}
            onPasteSlot={handlePaste}
            className={cn(commonInputBase, SLOT_HEIGHT, FONT_SIZE)}
            style={{
              ...base,
              color: active ? "#ffffff" : base.color,
              background: active ? "transparent" : base.background,
              borderColor: active ? "transparent" : base.borderColor,
            }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  public API                                                          */
/* ------------------------------------------------------------------ */
const DEFAULT_VARIANTS: OtpVariant[] = ["classic", "underline", "pill", "filled"];
export interface OtpInputProps {
  length?: number;
  variant?: OtpVariant;
  variants?: OtpVariant[];
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  theme?: ThemeMode | "system";
}

export function OtpInput({
  length = 6,
  variant,
  variants: variantsProp,
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  className,
  theme = "system",
}: OtpInputProps) {
  const resolvedTheme = useResolvedTheme(theme);

  if (variant) {
    return (
      <div className={cn("flex w-full", className)}>
        <OtpCore
          length={length}
          variant={variant}
          value={value}
          onChange={onChange}
          onComplete={onComplete}
          disabled={disabled}
          autoFocus={autoFocus}
          themeMode={resolvedTheme}
        />
      </div>
    );
  }

  // const variants: OtpVariant[] = ["classic", "underline", "pill", "filled"];
  const variants = variantsProp ?? DEFAULT_VARIANTS;

  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 place-items-center gap-y-[56px] gap-x-6 md:grid-cols-2 md:gap-y-[72px] md:gap-x-12",
        className
      )}
    >
      {variants.map((v) => (
        <div key={v} className="flex w-full items-center justify-center">
          <OtpCore length={length} variant={v} disabled={disabled} autoFocus={false} themeMode={resolvedTheme} />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  demo shell                                                          */
/* ------------------------------------------------------------------ */

export default function OtpShowcase() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden p-4 transition-colors duration-500 md:p-8",
        isDark ? "bg-[#0a0a12]" : "bg-[#f8f7fc]"
      )}
      style={{ minHeight: 560 }}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{
          background: isDark
            ? "radial-gradient(circle, #4c1d95, transparent 70%)"
            : "radial-gradient(circle, #c4b5fd, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{
          background: isDark
            ? "radial-gradient(circle, #1e3a8a, transparent 70%)"
            : "radial-gradient(circle, #bfdbfe, transparent 70%)",
        }}
      />

      <button
        type="button"
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        aria-label="Toggle color theme"
        className={cn(
          "absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full transition-colors md:right-6 md:top-6",
          isDark ? "bg-white/10 text-white hover:bg-white/20" : "bg-black/5 text-slate-700 hover:bg-black/10"
        )}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="relative z-10 w-full max-w-[900px] p-4 md:p-6">
        <OtpInput length={6} theme={theme} />
      </div>
    </div>
  );
}
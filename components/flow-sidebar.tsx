"use client";

/**
 * AnimatedSidebar
 *
 * A minimalist, scroll-aware table-of-contents navigation. When the active
 * section changes, a temporary curved SVG line draws from the old dot to the
 * new dot, pauses briefly, then retracts along the same path, leaving nothing
 * behind.
 *
 * Requirements: React 18+, Tailwind CSS, framer-motion.
 * Scrolling is tracked on `window` (the document scroller).
 *
 * Customisation (CSS custom properties, set on the component or any ancestor):
 *   --animated-sidebar-text-active
 *   --animated-sidebar-text-inactive
 *   --animated-sidebar-accent          (or use the `accentColor` prop)
 *   --animated-sidebar-item-gap
 *   --animated-sidebar-label-gap
 *   --animated-sidebar-gutter          (width/height of the indicator gutter)
 *   --animated-sidebar-dot-inset       (dot distance from the gutter's left edge)
 * `indicatorSize` and `lineWidth` are props and write
 *   --animated-sidebar-indicator-size / --animated-sidebar-line-width.
 *
 * `href` on a section is used as the link's href. If the section's element
 * exists on the current page, the click is intercepted and scrolled to with
 * the configured offset; otherwise the browser navigates normally.
 */

import { animate, useMotionValue } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type SidebarSection = {
  id: string;
  label: string;
  href?: string;
};

export type AnimatedSidebarProps = {
  sections: SidebarSection[];

  /** Controlled active section. */
  activeSectionId?: string;
  /** Initial active section when uncontrolled. Defaults to the first section. */
  defaultActiveSectionId?: string;
  onActiveChange?: (id: string) => void;

  ariaLabel?: string;
  /** Heading shown above the list (vertical mode only). Pass "" to hide. Default "Contents". */
  title?: string;

  /** Px below the sticky-header offset where the reading line sits. Default 24. */
  activationOffset?: number;
  /** Height (px) of a sticky header; used for the reading line and click scrolling. Default 0. */
  scrollOffset?: number;

  /** Milliseconds. Defaults: 320 / 70 / 320. */
  expandDuration?: number;
  pauseDuration?: number;
  retractDuration?: number;

  /** Multiplier for how far the curve bows. Default 1. */
  curveStrength?: number;
  /** Stroke width in px. Default 2.5. */
  lineWidth?: number;
  /** Active dot diameter in px (inactive dots are 75%). Default 8. */
  indicatorSize?: number;

  accentColor?: string;
  className?: string;

  orientation?: "vertical" | "horizontal" | "responsive";
  /**
   * Virtual scrolling: wheel/touch input over the component's box drives the active
   * item and the page never scrolls (useful for isolated previews with no sections).
   * Default (undefined) = automatic: enabled only when none of the section elements exist.
   */
  virtualScroll?: boolean;
  /** Viewport width (px) at or below which "responsive" becomes horizontal. Default 640. */
  responsiveBreakpoint?: number;
};

type Phase = "expand" | "pause" | "retract";
type Point = { x: number; y: number };
type Transition = {
  seq: number;
  from: string;
  to: string;
  d: string;
  w: number;
  h: number;
  phase: Phase;
};

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const MIN_BULGE = 9;
const MAX_BULGE = 28;
const SILENT_WINDOW_MS = 150;
/** Virtual wheel/touch travel (px) needed to move one item in virtual-scroll mode. */
const VIRTUAL_PX_PER_ITEM = 220;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");

const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));

/** Nearest ancestor that actually scrolls, or null when the window scrolls. */
function findScroller(el: HTMLElement): HTMLElement | null {
  let p = el.parentElement;
  while (p && p !== document.body && p !== document.documentElement) {
    const oy = getComputedStyle(p).overflowY;
    if (
      (oy === "auto" || oy === "scroll" || oy === "overlay") &&
      p.scrollHeight > p.clientHeight
    ) {
      return p;
    }
    p = p.parentElement;
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*                                    Hooks                                   */
/* -------------------------------------------------------------------------- */

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/* -------------------------------------------------------------------------- */
/*                                  Geometry                                  */
/* -------------------------------------------------------------------------- */

/**
 * Builds a cubic Bézier from dot A to dot B that bows toward the gutter side
 * (left in vertical mode, up in horizontal mode), like a rounded "(".
 * The shape is symmetric, so reversing direction reuses the same route.
 */
function buildPath(
  a: Point,
  b: Point,
  vertical: boolean,
  lineWidth: number,
  strength: number,
): string {
  const along0 = vertical ? a.y : a.x;
  const along1 = vertical ? b.y : b.x;
  const cross = vertical ? (a.x + b.x) / 2 : (a.y + b.y) / 2;
  const dist = along1 - along0;

  // Never leave the indicator gutter (cross coordinate 0 is its outer edge).
  const maxBulge = Math.max(0, cross - lineWidth / 2 - 0.5);
  const bulge = Math.min(
    maxBulge,
    clamp(Math.abs(dist) * 0.3, MIN_BULGE, MAX_BULGE) * strength,
  );
  // A cubic with both control points at offset h reaches 0.75h at its midpoint.
  const h = bulge / 0.75;

  const p = (al: number, cr: number): string =>
    vertical ? `${cr} ${al}` : `${al} ${cr}`;

  return [
    `M ${p(along0, cross)}`,
    `C ${p(along0 + dist * 0.22, cross - h)}`,
    `${p(along1 - dist * 0.22, cross - h)}`,
    `${p(along1, cross)}`,
  ].join(" ");
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export function AnimatedSidebar({
  sections,
  activeSectionId,
  defaultActiveSectionId,
  onActiveChange,
  ariaLabel = "Table of contents",
  title = "Contents",
  activationOffset = 24,
  scrollOffset = 0,
  expandDuration = 320,
  pauseDuration = 70,
  retractDuration = 320,
  curveStrength = 1,
  lineWidth = 2.5,
  indicatorSize = 8,
  accentColor,
  className,
  orientation = "vertical",
  virtualScroll,
  responsiveBreakpoint = 640,
}: AnimatedSidebarProps) {
  /* ------------------------------ Normalisation ----------------------------- */

  // Defensive de-duplication: the first occurrence of an id wins.
  const items = useMemo(() => {
    const seen = new Set<string>();
    const out: SidebarSection[] = [];
    for (const s of sections) {
      if (seen.has(s.id)) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[AnimatedSidebar] Duplicate section id "${s.id}" ignored.`);
        }
        continue;
      }
      seen.add(s.id);
      out.push(s);
    }
    return out;
  }, [sections]);

  const idsKey = items.map((s) => s.id).join("\u0000");

  const isControlled = activeSectionId !== undefined;
  const [internalId, setInternalId] = useState<string | null>(null);

  const pick = (id: string | null | undefined): string | null =>
    id && items.some((s) => s.id === id) ? id : null;

  const effectiveActive: string | null =
    pick(activeSectionId) ??
    pick(internalId) ??
    pick(defaultActiveSectionId) ??
    items[0]?.id ??
    null;

  const [autoVirtual, setAutoVirtual] = useState(false);
  const virtual = virtualScroll ?? autoVirtual;

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const narrow = useMediaQuery(`(max-width: ${responsiveBreakpoint}px)`);
  const horizontal =
    orientation === "horizontal" || (orientation === "responsive" && narrow);

  /* --------------------------------- Refs ---------------------------------- */

  const navRef = useRef<HTMLElement | null>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0); // virtual scroll progress, 0..1
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const slotRefs = useRef(new Map<string, HTMLSpanElement>());

  const latest = useRef({
    items,
    scrollOffset,
    activationOffset,
    expandDuration,
    pauseDuration,
    retractDuration,
    curveStrength,
    lineWidth,
    onActiveChange,
    isControlled,
    reduced,
    horizontal,
    effectiveActive,
    virtual,
  });
  useIsoLayoutEffect(() => {
    latest.current = {
      items,
      scrollOffset,
      activationOffset,
      expandDuration,
      pauseDuration,
      retractDuration,
      curveStrength,
      lineWidth,
      onActiveChange,
      isControlled,
      reduced,
      horizontal,
      effectiveActive,
      virtual,
    };
  });

  const prevActiveRef = useRef<string | null>(effectiveActive);
  const silentUntilRef = useRef(0);

  /* ------------------------------- Animation ------------------------------- */

  const [transition, setTransition] = useState<Transition | null>(null);
  const dashOffset = useMotionValue(1);
  const runTokenRef = useRef(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const pauseTimerRef = useRef<number | undefined>(undefined);
  const runningRef = useRef(false);

  // Mirror the motion value onto the path imperatively (no React re-renders).
  useEffect(
    () =>
      dashOffset.on("change", (v) => {
        pathRef.current?.setAttribute("stroke-dashoffset", String(v));
      }),
    [dashOffset],
  );

  const cancelTransition = useCallback(() => {
    runTokenRef.current += 1; // invalidates any pending async completion
    controlsRef.current?.stop();
    controlsRef.current = null;
    window.clearTimeout(pauseTimerRef.current);
    runningRef.current = false;
  }, []);

  const measure = useCallback((id: string): Point | null => {
    const wrap = wrapRef.current;
    const slot = slotRefs.current.get(id);
    if (!wrap || !slot) return null;
    const w = wrap.getBoundingClientRect();
    const r = slot.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - w.left,
      y: r.top + r.height / 2 - w.top,
    };
  }, []);

  const runTransition = useCallback(
    (fromId: string, toId: string) => {
      cancelTransition();
      const token = runTokenRef.current;
      const L = latest.current;

      const wrap = wrapRef.current;
      const a = measure(fromId);
      const b = measure(toId);
      if (!wrap || !a || !b) {
        setTransition(null);
        return;
      }

      const box = wrap.getBoundingClientRect();
      const d = buildPath(a, b, !L.horizontal, L.lineWidth, L.curveStrength);

      dashOffset.set(1);
      runningRef.current = true;
      setTransition({
        seq: token,
        from: fromId,
        to: toId,
        d,
        w: box.width,
        h: box.height,
        phase: "expand",
      });

      const play = (target: number, ms: number) =>
        new Promise<void>((resolve) => {
          controlsRef.current = animate(dashOffset, target, {
            duration: Math.max(0, ms) / 1000,
            ease: EASE,
            onComplete: () => resolve(),
          });
        });

      const wait = (ms: number) =>
        new Promise<void>((resolve) => {
          pauseTimerRef.current = window.setTimeout(resolve, Math.max(0, ms));
        });

      const setPhase = (phase: Phase) =>
        setTransition((t) => (t && t.seq === token ? { ...t, phase } : t));

      void (async () => {
        await play(0, L.expandDuration); // draw A -> B
        if (token !== runTokenRef.current) return;
        setPhase("pause");
        await wait(L.pauseDuration);
        if (token !== runTokenRef.current) return;
        setPhase("retract");
        // Same path, same dash pattern: pushing the offset past 0 to -1 slides the dash
        // forward, erasing the stroke from the start (A) toward the end (B).
        await play(-1, L.retractDuration);
        if (token !== runTokenRef.current) return;
        runningRef.current = false;
        setTransition(null); // path is unmounted: zero residue
      })();
    },
    [cancelTransition, dashOffset, measure],
  );

  // Start a transition only when the effective active id actually changes.
  useEffect(() => {
    const prev = prevActiveRef.current;
    prevActiveRef.current = effectiveActive;
    if (prev === null || effectiveActive === null || prev === effectiveActive) {
      return;
    }
    const silent = performance.now() < silentUntilRef.current;
    if (silent || latest.current.reduced) {
      cancelTransition();
      setTransition(null);
      return;
    }
    runTransition(prev, effectiveActive);
  }, [effectiveActive, runTransition, cancelTransition]);

  // Layout/orientation/motion-preference changes invalidate any running path.
  useEffect(() => {
    cancelTransition();
    setTransition(null);
  }, [horizontal, reduced, cancelTransition]);

  // Resize during a transition: drop it; geometry is re-measured next time.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (runningRef.current) {
        cancelTransition();
        setTransition(null);
      }
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [cancelTransition]);

  useEffect(
    () => () => {
      cancelTransition();
    },
    [cancelTransition],
  );

  /* ---------------------------- Active-state commit ---------------------------- */

  const commit = useCallback((id: string, silent = false) => {
    const L = latest.current;
    if (id === L.effectiveActive) return;
    if (silent) silentUntilRef.current = performance.now() + SILENT_WINDOW_MS;
    if (!L.isControlled) {
      // Optimistic, so bursts of events in one frame don't double-notify.
      latest.current = { ...L, effectiveActive: id };
      setInternalId(id);
    }
    L.onActiveChange?.(id);
  }, []);

  /* --------------------------------- Scrollspy -------------------------------- */

  const lockRef = useRef(false);
  const lockTimerRef = useRef<number | undefined>(undefined);
  const spyRef = useRef<() => void>(() => {});

  const armLock = useCallback((ms: number) => {
    lockRef.current = true;
    window.clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      lockRef.current = false;
      spyRef.current();
    }, ms);
  }, []);

  useEffect(() => {
    if (!idsKey || virtualScroll === true) return;
    let frame = 0;
    let first = true;

    let cache: { el: HTMLElement; scroller: HTMLElement | null } | null = null;
    const scrollerFor = (el: HTMLElement): HTMLElement | null => {
      if (!cache || cache.el !== el || !el.isConnected) {
        cache = { el, scroller: findScroller(el) };
      }
      return cache.scroller;
    };

    const resolve = (): string | null => {
      const { items: list, scrollOffset: so, activationOffset: ao } = latest.current;
      const found: Array<{ id: string; el: HTMLElement }> = [];
      for (const s of list) {
        const el = document.getElementById(s.id);
        if (el) found.push({ id: s.id, el }); // missing targets are ignored
      }
      if (!found.length) return null;

      // Works for both window scrolling and an inner scroll container (e.g. a preview box).
      const scroller = scrollerFor(found[0].el);
      const rootTop = scroller ? scroller.getBoundingClientRect().top : 0;
      const line = rootTop + so + ao + 1;

      let best: { id: string; top: number } | null = null; // last crossed
      let firstEl: { id: string; top: number } | null = null; // topmost overall
      let lowest: { id: string; top: number } | null = null; // lowest in doc
      for (const { id, el } of found) {
        const top = el.getBoundingClientRect().top;
        if (!firstEl || top < firstEl.top) firstEl = { id, top };
        if (!lowest || top > lowest.top) lowest = { id, top };
        if (top <= line && (!best || top > best.top)) best = { id, top };
      }

      const atBottom = scroller
        ? scroller.scrollTop > 0 &&
          scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
        : window.scrollY > 0 &&
          window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 2;
      if (atBottom && lowest) return lowest.id; // lets short final sections activate
      return best?.id ?? firstEl?.id ?? null;
    };

    const compute = () => {
      frame = 0;
      if (lockRef.current) return;
      const id = resolve();
      if (!id) {
        setAutoVirtual(true); // no section elements on this page -> virtual scrolling
        return;
      }
      setAutoVirtual(false);
      commit(id, first);
      first = false;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(compute);
    };
    spyRef.current = schedule;

    const onScroll = () => {
      if (lockRef.current) {
        armLock(160); // still moving from a click: wait until it settles
        return;
      }
      schedule();
    };

    // capture: true also catches scrolling inside nested containers
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", schedule);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(schedule); // content height changes
      ro.observe(document.documentElement);
    }

    schedule();

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", schedule);
      ro?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(lockTimerRef.current);
      lockRef.current = false;
      spyRef.current = () => {};
    };
  }, [idsKey, commit, armLock, virtualScroll]);

  /* ----------------------------- Virtual scrolling ----------------------------- */

  // Keep the virtual position in step with the active item (clicks, mode switch).
  useEffect(() => {
    if (!virtual) return;
    const n = items.length;
    const idx = items.findIndex((s) => s.id === effectiveActive);
    if (n === 0 || idx < 0) return;
    if (Math.min(n - 1, Math.floor(progressRef.current * n)) !== idx) {
      progressRef.current = (idx + 0.5) / n;
    }
  }, [virtual, effectiveActive, idsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const box = captureRef.current;
    if (!virtual || !box || !idsKey) return;

    // Moves at most ONE item per transition, so each curve can be seen playing
    // out fully instead of being skipped by fast wheel/trackpad input.
    let lockUntil = 0;
    const apply = (delta: number) => {
      const L = latest.current;
      const list = L.items;
      const n = list.length;
      if (!n) return;
      const cur = list.findIndex((s) => s.id === L.effectiveActive);
      if (cur < 0) return;

      progressRef.current = clamp(
        progressRef.current + delta / (n * VIRTUAL_PX_PER_ITEM),
        0,
        1,
      );
      const target = Math.min(n - 1, Math.floor(progressRef.current * n));
      if (target === cur) return;

      const now = performance.now();
      if (now < lockUntil) {
        // Transition still playing: don't run ahead of the active item.
        progressRef.current = clamp(progressRef.current, cur / n, (cur + 1) / n - 1e-6);
        return;
      }

      const next = cur + (target > cur ? 1 : -1);
      lockUntil = L.reduced
        ? 0
        : now + L.expandDuration + L.pauseDuration + L.retractDuration + 80;
      progressRef.current = (next + 0.5) / n;
      commit(list[next].id);
    };

    // preventDefault + stopPropagation: nothing else on the page scrolls
    // (also keeps smooth-scroll libraries from seeing the gesture).
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      apply(e.deltaY);
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const y = e.touches[0].clientY;
      const delta = touchY - y;
      touchY = y;
      apply(delta);
    };

    box.addEventListener("wheel", onWheel, { passive: false });
    box.addEventListener("touchstart", onTouchStart, { passive: true });
    box.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      box.removeEventListener("wheel", onWheel);
      box.removeEventListener("touchstart", onTouchStart);
      box.removeEventListener("touchmove", onTouchMove);
    };
  }, [virtual, idsKey, commit]);

  /* ---------------------------------- Clicks --------------------------------- */

  const handleClick = (e: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    const target = document.getElementById(id);
    if (!target) {
      // Virtual mode (no section elements): just activate. Otherwise let the browser handle it.
      if (latest.current.virtual) {
        e.preventDefault();
        commit(id);
      }
      return;
    }

    e.preventDefault();
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    const scroller = findScroller(target);
    const targetTop = target.getBoundingClientRect().top;

    armLock(220); // ignore intermediate sections while the scroll runs
    commit(id);
    if (scroller) {
      const top = Math.max(
        0,
        scroller.scrollTop +
          targetTop -
          scroller.getBoundingClientRect().top -
          scrollOffset,
      );
      scroller.scrollTo({ top, behavior });
    } else {
      window.scrollTo({
        top: Math.max(0, targetTop + window.scrollY - scrollOffset),
        behavior,
      });
    }

    const section = latest.current.items.find((s) => s.id === id);
    if (!section?.href || section.href.startsWith("#")) {
      try {
        history.replaceState(null, "", `#${id}`);
      } catch {
        /* sandboxed previews may forbid this */
      }
    }
  };

  /* -------------------- Keep the active link visible (horizontal) -------------------- */

  useEffect(() => {
    if (!horizontal) return;
    const nav = navRef.current;
    const el = nav?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!nav || !el) return;
    const n = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    let left = nav.scrollLeft;
    if (r.left < n.left) left += r.left - n.left - 8;
    else if (r.right > n.right) left += r.right - n.right + 8;
    if (left !== nav.scrollLeft) {
      nav.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
    }
  }, [effectiveActive, horizontal, reduced]);

  /* --------------------------------- Rendering -------------------------------- */

  const isAccent = (id: string): boolean => {
    if (!transition) return id === effectiveActive;
    switch (transition.phase) {
      case "expand":
        return id === transition.from;
      case "pause":
        return id === transition.from || id === transition.to;
      case "retract":
        return id === transition.to;
    }
  };

  const navStyle = {
    "--animated-sidebar-indicator-size": `${indicatorSize}px`,
    "--animated-sidebar-line-width": `${lineWidth}px`,
    ...(accentColor ? { "--animated-sidebar-accent": accentColor } : null),
  } as CSSProperties;

  return (
    <div
      ref={captureRef}
      data-lenis-prevent={virtual ? "" : undefined}
      className={virtual ? "flex h-full w-full items-center justify-center" : "contents"}
      style={
        virtual
          ? { overflow: "hidden", touchAction: "none", userSelect: "none" }
          : undefined
      }
    >
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      style={navStyle}
      className={cx(
        "min-w-0 max-w-full font-sans",
        horizontal && "overflow-x-auto overflow-y-hidden",
        className,
      )}
    >
      {title && !horizontal && (
        <p
          className="mb-6 text-[17px] font-medium uppercase tracking-[0.08em] text-[color:var(--animated-sidebar-text-active,#24262b)] dark:text-[color:var(--animated-sidebar-text-active,#f4f4f5)]"
        >
          {title}
        </p>
      )}
      <div
        ref={wrapRef}
        className={cx("relative", horizontal ? "w-max min-w-full" : "w-full")}
      >
        {transition && (
          <svg
            aria-hidden="true"
            focusable="false"
            width={transition.w}
            height={transition.h}
            viewBox={`0 0 ${transition.w} ${transition.h}`}
            className="pointer-events-none absolute left-0 top-0 z-0 overflow-visible"
          >
            <path
              key={transition.seq}
              ref={(el) => {
                pathRef.current = el;
                if (el) el.setAttribute("stroke-dashoffset", String(dashOffset.get()));
              }}
              d={transition.d}
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                stroke: "var(--animated-sidebar-accent, #ff5a4f)",
                strokeWidth: "var(--animated-sidebar-line-width, 2.5px)",
              }}
            />
          </svg>
        )}

        <ul
          className={cx(
            "relative z-10 m-0 list-none p-0",
            horizontal
              ? "flex flex-row items-end gap-x-[calc(var(--animated-sidebar-item-gap,14px)*1.5)]"
              : "flex flex-col gap-y-[var(--animated-sidebar-item-gap,14px)]",
          )}
        >
          {items.map((section) => {
            const active = section.id === effectiveActive;
            const accent = isAccent(section.id);
            return (
              <li key={section.id} className="min-w-0">
                <a
                  href={section.href ?? `#${section.id}`}
                  aria-current={active ? "location" : undefined}
                  onClick={(e) => handleClick(e, section.id)}
                  className={cx(
                    "group rounded-sm text-base leading-snug no-underline outline-none transition-colors duration-200 motion-reduce:transition-none",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--animated-sidebar-accent,#ff5a4f)]",
                    horizontal
                      ? "flex flex-col items-center gap-1 whitespace-nowrap"
                      : "flex items-center gap-[var(--animated-sidebar-label-gap,0px)]",
                    active
                      ? "text-[color:var(--animated-sidebar-text-active,#24262b)] dark:text-[color:var(--animated-sidebar-text-active,#f4f4f5)]"
                      : "text-[color:var(--animated-sidebar-text-inactive,#8b8f98)] hover:text-[color:var(--animated-sidebar-text-active,#24262b)] dark:text-[color:var(--animated-sidebar-text-inactive,#9ca3af)] dark:hover:text-[color:var(--animated-sidebar-text-active,#f4f4f5)]",
                  )}
                >
                  {/* Indicator gutter: reserved independently of label width */}
                  <span
                    aria-hidden="true"
                    className={cx(
                      "flex shrink-0",
                      horizontal
                        ? "h-[var(--animated-sidebar-gutter,28px)] w-full items-end justify-center"
                        : "w-[var(--animated-sidebar-gutter,40px)] items-center justify-start pl-[var(--animated-sidebar-dot-inset,14px)]",
                    )}
                  >
                    {/* Fixed-size slot: its centre is the stable measuring point */}
                    <span
                      ref={(el) => {
                        if (el) slotRefs.current.set(section.id, el);
                        else slotRefs.current.delete(section.id);
                      }}
                      className="relative block shrink-0"
                      style={{
                        width: "var(--animated-sidebar-indicator-size, 8px)",
                        height: "var(--animated-sidebar-indicator-size, 8px)",
                      }}
                    >
                      <span
                        className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color,opacity] duration-200 motion-reduce:transition-none"
                        style={{
                          width: accent
                            ? "var(--animated-sidebar-indicator-size, 8px)"
                            : "calc(var(--animated-sidebar-indicator-size, 8px) * 0.75)",
                          height: accent
                            ? "var(--animated-sidebar-indicator-size, 8px)"
                            : "calc(var(--animated-sidebar-indicator-size, 8px) * 0.75)",
                          backgroundColor: accent
                            ? "var(--animated-sidebar-accent, #ff5a4f)"
                            : "var(--animated-sidebar-text-inactive, #9ca3af)",
                          opacity: accent ? 1 : 0,
                        }}
                      />
                    </span>
                  </span>

                  {/* Hidden medium-weight twin reserves width so weight changes don't shift layout */}
                  <span
                    data-label={section.label}
                    className={cx(
                      "inline-flex min-w-0 flex-col",
                      horizontal ? "items-center" : "break-words",
                      active ? "font-medium" : "font-normal",
                      "after:pointer-events-none after:invisible after:block after:h-0 after:select-none after:overflow-hidden after:font-medium after:content-[attr(data-label)]",
                    )}
                  >
                    {section.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
    </div>
  );
}

export default AnimatedSidebar;
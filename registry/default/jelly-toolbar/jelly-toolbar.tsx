"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
  type SpringOptions,
} from "framer-motion";
import {
  MessageSquare,
  Inbox,
  Settings,
  Eye,
  Send,
  Menu as MenuIcon,
  type LucideIcon,
} from "lucide-react";

export interface JellyToolbarItem {
  label: string;
  icon: LucideIcon;
  /** Single-character keyboard shortcut, e.g. "S" for Settings. Optional. */
  shortcut?: string;
  onSelect?: () => void;
}

export interface JellyToolbarProps {
  items?: JellyToolbarItem[];
  /** Jelly color in light mode. */
  jellyColor?: string;
  /** Jelly color in dark mode. Defaults to a slightly richer version of jellyColor. */
  jellyColorDark?: string;
  className?: string;
  /** Spring stiffness for jelly movement — higher = snappier. */
  stiffness?: number;
  /** Spring damping for jelly movement — higher = less overshoot. */
  damping?: number;
  /** Whether pressing an item's configured shortcut key activates it globally. */
  enableShortcuts?: boolean;
}

const DEFAULT_ITEMS: JellyToolbarItem[] = [
  { label: "Chat", icon: MessageSquare, shortcut: "C" },
  { label: "Inbox", icon: Inbox, shortcut: "I" },
  { label: "Settings", icon: Settings, shortcut: "S" },
  { label: "Preview", icon: Eye, shortcut: "P" },
  { label: "Send", icon: Send, shortcut: "E" },
  { label: "Menu", icon: MenuIcon, shortcut: "M" },
];

// Toolbar's own inner padding (the pill's "wall thickness" the jelly can
// touch on the first/last item) and the gap the jelly keeps from a
// section's inner divider on middle items.
const TOOLBAR_PADDING = 6;
const ITEM_INSET = 5;
const SQUARE_RADIUS = 14; // "rounded-square" corner
const FULL_RADIUS = 999; // pill-curvature corner

// Critical damping for a spring of a given stiffness (mass = 1):
// c_crit = 2 * sqrt(k * m). At or above this value the spring cannot
// overshoot its target — it approaches asymptotically instead of
// oscillating around it. This is what guarantees the jelly's POSITION
// arrives and stays exactly on target with zero bounce-back, no matter
// how fast it was traveling.
function criticalDamping(stiffness: number, mass = 1) {
  return 2 * Math.sqrt(stiffness * mass);
}

export function JellyToolbar({
  items = DEFAULT_ITEMS,
  jellyColor = "#c4b5fd", // soft lavender
  jellyColorDark,
  className = "",
  stiffness = 380,
  damping,
  enableShortcuts = true,
}: JellyToolbarProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  // Kept separate from activeIndex so the jelly can persist at the last
  // known position after the pointer leaves, while the tooltip still
  // correctly hides.
  const [hovered, setHovered] = React.useState(false);

  const total = items.length;

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setContainerWidth(width);
    });
    observer.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  // ---- Geometry for a given index --------------------------------------
  const geometryFor = React.useCallback(
    (index: number) => {
      if (!containerWidth || total === 0) {
        return { x: 0, width: 0, radii: [SQUARE_RADIUS, SQUARE_RADIUS, SQUARE_RADIUS, SQUARE_RADIUS] as const };
      }
      const itemWidth = (containerWidth - TOOLBAR_PADDING * 2) / total;
      const sectionLeft = TOOLBAR_PADDING + index * itemWidth;
      const sectionRight = sectionLeft + itemWidth;
      const isFirst = index === 0;
      const isLast = index === total - 1;

      const left = isFirst ? TOOLBAR_PADDING : sectionLeft + ITEM_INSET;
      const right = isLast ? containerWidth - TOOLBAR_PADDING : sectionRight - ITEM_INSET;
      const width = right - left;

      // [topLeft, topRight, bottomRight, bottomLeft]
      let radii: [number, number, number, number];
      if (isFirst) {
        radii = [FULL_RADIUS, SQUARE_RADIUS, SQUARE_RADIUS, FULL_RADIUS];
      } else if (isLast) {
        radii = [SQUARE_RADIUS, FULL_RADIUS, FULL_RADIUS, SQUARE_RADIUS];
      } else {
        radii = [SQUARE_RADIUS, SQUARE_RADIUS, SQUARE_RADIUS, SQUARE_RADIUS];
      }

      return { x: left, width, radii };
    },
    [containerWidth, total]
  );

  // ---- Motion values -----------------------------------------------------
  // POSITION springs (x, width): these define WHERE the jelly ends up and
  // MUST be critically damped (or slightly over-damped) so they never
  // overshoot the target and never need a corrective bounce-back.
  // If the caller passes an explicit `damping`, we still floor it at the
  // critical value so an underdamped prop can't reintroduce bounce.
  const positionDamping = Math.max(damping ?? criticalDamping(stiffness), criticalDamping(stiffness));
  const positionSpringConfig: SpringOptions = prefersReducedMotion
    ? { stiffness: 1000, damping: 100 }
    : { stiffness, damping: positionDamping };

  const x = useMotionValue(0);
  const width = useMotionValue(0);
  const springX = useSpring(x, positionSpringConfig);
  const springWidth = useSpring(width, positionSpringConfig);

  // SHAPE/corner-radius springs: these are part of the jelly's deformation
  // (how "square" vs "pill" its corners look as it crosses sections) and
  // are also critically damped so the outline settles cleanly without a
  // secondary wobble, while still moving at its own slightly softer pace.
  const radiusStiffness = stiffness * 0.9;
  const radiusSpringConfig: SpringOptions = prefersReducedMotion
    ? { stiffness: 1000, damping: 100 }
    : { stiffness: radiusStiffness, damping: criticalDamping(radiusStiffness) };

  const tl = useMotionValue(SQUARE_RADIUS);
  const tr = useMotionValue(SQUARE_RADIUS);
  const br = useMotionValue(SQUARE_RADIUS);
  const bl = useMotionValue(SQUARE_RADIUS);
  const springTl = useSpring(tl, radiusSpringConfig);
  const springTr = useSpring(tr, radiusSpringConfig);
  const springBr = useSpring(br, radiusSpringConfig);
  const springBl = useSpring(bl, radiusSpringConfig);

  // Velocity of the jelly's horizontal travel drives the squash/stretch —
  // fast movement stretches it wider & thinner; it snaps back to normal
  // as it decelerates into a settle. Because springX is now critically
  // damped, its velocity decays to zero monotonically (never reverses
  // sign), so this stays purely a function of "how fast is it still
  // traveling" and naturally returns to scale 1 exactly when motion
  // stops — no independent bounce of its own.
  const xVelocity = useVelocity(springX);
  const stretch = useTransform(
    xVelocity,
    [-2200, 0, 2200],
    prefersReducedMotion ? [1, 1, 1] : [1.35, 1, 1.35]
  );
  const squash = useTransform(
    xVelocity,
    [-2200, 0, 2200],
    prefersReducedMotion ? [1, 1, 1] : [0.9, 1, 0.9]
  );

  // Push new geometry whenever the active index (or measured width) changes.
  React.useEffect(() => {
    const target = geometryFor(activeIndex ?? 0);
    x.set(target.x);
    width.set(target.width);
    tl.set(target.radii[0]);
    tr.set(target.radii[1]);
    br.set(target.radii[2]);
    bl.set(target.radii[3]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, containerWidth, total]);

  // ---- Pointer tracking ---------------------------------------------------
  // Index is derived from continuous pointer position, not per-button
  // onMouseEnter — this is what makes the jelly start moving the instant
  // the cursor crosses a section boundary rather than waiting for it to
  // fully land inside the next button.
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return; // touch uses tap activation instead
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || total === 0) return;
    const relativeX = e.clientX - rect.left - TOOLBAR_PADDING;
    const itemWidth = (rect.width - TOOLBAR_PADDING * 2) / total;
    const index = Math.min(total - 1, Math.max(0, Math.floor(relativeX / itemWidth)));
    setActiveIndex(index);
    setHovered(true);
  }

  function handlePointerLeave() {
    setHovered(false);
    // Jelly intentionally stays parked at the last active section instead
    // of snapping away — matches "settle" behavior even after the cursor
    // leaves the toolbar entirely.
  }

  function selectIndex(index: number) {
    setActiveIndex(index);
    items[index]?.onSelect?.();
  }

  // ---- Global keyboard shortcuts ------------------------------------------
  React.useEffect(() => {
    if (!enableShortcuts) return;
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      const index = items.findIndex(
        (item) => item.shortcut && item.shortcut.toLowerCase() === e.key.toLowerCase()
      );
      if (index !== -1) {
        e.preventDefault();
        selectIndex(index);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, enableShortcuts]);

  const resolvedJellyColorDark = jellyColorDark ?? jellyColor;
  const showTooltip = hovered && activeIndex !== null;
  const tooltipItem = activeIndex !== null ? items[activeIndex] : null;
  const tooltipCenter = activeIndex !== null ? geometryFor(activeIndex).x + geometryFor(activeIndex).width / 2 : 0;

  return (
    <div
      className={`relative mx-auto flex w-full flex-col items-center ${className}`}
      // Mobile: unchanged — width is still fully driven by
      // calc(100vw - 32px) exactly as before, and on any phone-width
      // viewport that value sits well below 340px, so this min() only
      // ever bites on desktop. Height: the tooltip row keeps its
      // `sm:h-7` desktop-only shrink (mobile stays h-9), while the pill
      // itself is h-14 at every breakpoint (same value mobile already
      // used), giving a desktop total of 28px + 56px = 84px. Mobile
      // total remains 36px + 56px = 92px, exactly as before.
      style={{ width: "min(340px, calc(100vw - 32px))" }}
    >
      {/* Tooltip */}
      <div className="relative h-9 w-full sm:h-7">
        {tooltipItem && (
          <motion.div
            className="pointer-events-none absolute -top-1 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
            style={{ left: tooltipCenter }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: showTooltip ? 1 : 0, y: showTooltip ? 0 : 4 }}
            transition={{ duration: 0.15 }}
          >
            <span>{tooltipItem.label}</span>
            {tooltipItem.shortcut && (
              <span className="rounded border border-neutral-200 px-1 text-[10px] text-neutral-400 dark:border-neutral-600 dark:text-neutral-500">
                {tooltipItem.shortcut}
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Toolbar */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative flex h-14 w-full max-w-full items-stretch rounded-full border border-neutral-200 bg-white p-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-900"
      >
        {/* Jelly */}
        {containerWidth > 0 && (
          <motion.div
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 dark:hidden"
            style={{
              x: springX,
              width: springWidth,
              scaleX: stretch,
              scaleY: squash,
              backgroundColor: jellyColor,
              borderTopLeftRadius: springTl,
              borderTopRightRadius: springTr,
              borderBottomRightRadius: springBr,
              borderBottomLeftRadius: springBl,
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.06)",
            }}
          />
        )}
        {containerWidth > 0 && (
          <motion.div
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 hidden dark:block"
            style={{
              x: springX,
              width: springWidth,
              scaleX: stretch,
              scaleY: squash,
              backgroundColor: resolvedJellyColorDark,
              borderTopLeftRadius: springTl,
              borderTopRightRadius: springTr,
              borderBottomRightRadius: springBr,
              borderBottomLeftRadius: springBl,
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.12), 0 2px 6px rgba(0,0,0,0.35)",
            }}
          />
        )}

        {/* Items */}
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeIndex === index;
          return (
            <React.Fragment key={item.label}>
              <button
                type="button"
                aria-label={item.label}
                aria-pressed={isActive}
                onPointerDown={() => selectIndex(index)}
                onFocus={() => {
                  setActiveIndex(index);
                  setHovered(true);
                }}
                onBlur={() => setHovered(false)}
                className="relative z-10 flex flex-1 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#0d7d86] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900"
              >
                <Icon
                  size={18}
                  strokeWidth={2}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-violet-700 dark:text-violet-200"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                />
              </button>
              {index < items.length - 1 && (
                <div
                  aria-hidden="true"
                  className="my-2.5 w-px shrink-0 bg-neutral-200/70 dark:bg-neutral-700/60"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default JellyToolbar;
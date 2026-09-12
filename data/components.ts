// data/components.ts
//
// Central registry for the /components section. Mirrors the pattern used
// by data/blog.ts — one typed array, consumed by both the listing page
// (app/components/page.tsx) and the detail page (app/components/[slug]/page.tsx).
//
// NOTE: I only had visibility into ~10 of your 13 components from the
// screenshots (Floating Toolbar, Filter Selector, Scroll Progress, Floating
// Tabs, Confetti Button, a shimmer-text one whose name was cut off, Particles,
// Testimonial Marquee, Search Bar, Command Palette). Fill in the real name +
// description for the shimmer-text one and add your remaining 2-3 entries —
// I didn't want to guess at real product copy.

export type ComponentStatus = "new" | "stable";

export interface PropDefinition {
  property: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentEntry {
  slug: string;
  name: string;
  /** Short description shown on the listing card (1-2 lines, gets truncated) */
  cardDescription: string;
  /** Longer description shown on the detail page under the title */
  fullDescription: string;
  /** lucide-react icon name, rendered on the listing card */
  icon: string;
  status: ComponentStatus;
  installCommand: string; // e.g. "npx shadcn@latest add https://yourdomain.com/r/filter-selector.json"
  importStatement: string; // e.g. `import { FilterSelector } from "@/components/filter-selector"`
  usageJsx: string; // e.g. "<FilterSelector />"
  props: PropDefinition[];
  /** Full source shown in the Code tab of the preview panel */
  sourceCode: string;
  previewCode: string;
}

export const components: ComponentEntry[] = [
  {
    slug: "drag-drop-reorder",
    name: "Drag & Drop Reorder",
    cardDescription:
      "A smooth, accessible sortable list with spring physics and a glow while dragging.",
    fullDescription:
      "A smooth, customizable, and accessible sortable list for modern applications.",
    icon: "GripVertical",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/drag-drop-reorder.json",
    importStatement: `import { DragDropReorder } from "@/components/drag-drop-reorder"`,
    usageJsx: "<DragDropReorder />",
    props: [
      { property: "items", type: "ReorderItem[]", default: "-", description: "Array of { id, title, description, icon, color } (controlled)." },
      { property: "onReorder", type: "function", default: "-", description: "Callback fired with the new order when dragging ends." },
      { property: "className", type: "string", default: "-", description: "Additional classes applied to the outer card." },
    ],
    // Shown in the docs page's "Code" tab. Kept intentionally short —
    // this is how a consumer actually uses the component, not the
    // implementation itself.
    previewCode: `import { DragDropReorder } from "@/components/drag-drop-reorder";

export default function DragDropReorderPreview() {
  return <DragDropReorder />;
}
`,
    // Full implementation. Not rendered anywhere in the docs UI directly —
    // intended as the source your registry JSON route serves to the CLI.
    // (See note below on wiring up a real /r/drag-drop-reorder.json route.)
    sourceCode: `"use client";

import * as React from "react";
import { Reorder } from "framer-motion";
import {
  GripVertical,
  ChevronRight,
  Image,
  Code2,
  TerminalSquare,
  CloudUpload,
  RefreshCw,
  typqe LucideIcon,
} from "lucide-react";

export type ReorderColor = "pink" | "blue" | "violet" | "orange" | "neutral";

export interface ReorderItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: ReorderColor;
}

const defaultItems: ReorderItem[] = [
  { id: "design", title: "Design", description: "Create beautiful experiences", icon: Image, color: "pink" },
  { id: "develop", title: "Develop", description: "Build with modern tools", icon: Code2, color: "blue" },
  { id: "test", title: "Test", description: "Ensure everything works", icon: TerminalSquare, color: "neutral" },
  { id: "deploy", title: "Deploy", description: "Launch to the world", icon: CloudUpload, color: "violet" },
  { id: "iterate", title: "Iterate", description: "Make it better", icon: RefreshCw, color: "orange" },
];

const colorMap: Record<ReorderColor, string> = {
  pink: "bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400",
  neutral: "bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white",
};

export interface DragDropReorderProps {
  items?: ReorderItem[];
  onReorder?: (items: ReorderItem[]) => void;
  className?: string;
}

export function DragDropReorder({ items, onReorder, className = "" }: DragDropReorderProps) {
  const [internalItems, setInternalItems] = React.useState<ReorderItem[]>(defaultItems);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);

  const isControlled = Array.isArray(items);
  const values = isControlled ? (items as ReorderItem[]) : internalItems;
  const setValues = isControlled ? (onReorder as (items: ReorderItem[]) => void) : setInternalItems;

  return (
    <Reorder.Group axis="y" values={values} onReorder={setValues} className={\`flex flex-col gap-3 \${className}\`}>
      {values.map((item) => {
        const Icon = item.icon;
        const isDragging = draggingId === item.id;

        return (
          <Reorder.Item
            key={item.id}
            value={item}
            onDragStart={() => setDraggingId(item.id)}
            onDragEnd={() => setDraggingId(null)}
            whileDrag={{ scale: 1.02, cursor: "grabbing" }}
            className={[
              "relative flex items-center gap-4 rounded-2xl px-4 py-3.5 select-none",
              "bg-white dark:bg-neutral-900",
              "border border-neutral-100 dark:border-neutral-800",
              isDragging
                ? "ring-2 ring-violet-500/60 shadow-[0_0_24px_rgba(56,189,248,0.35)]"
                : "shadow-sm",
            ].join(" ")}
          >
            <div className="cursor-grab active:cursor-grabbing touch-none text-neutral-300 dark:text-neutral-600" aria-hidden="true">
              <GripVertical size={18} />
            </div>

            <div className={\`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 \${colorMap[item.color] ?? colorMap.neutral}\`}>
              <Icon size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold leading-tight text-neutral-900 dark:text-neutral-50">{item.title}</div>
              <div className="text-sm leading-tight mt-0.5 text-neutral-500 dark:text-neutral-400">{item.description}</div>
            </div>

            <ChevronRight size={18} className="text-neutral-300 dark:text-neutral-600 shrink-0" />
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
}

export { defaultItems as dragDropReorderDefaultItems };
export default DragDropReorder;
`,
  },

  {
    slug: "liquid-scroll-progress",
    name: "Liquid Scroll Progress",
    cardDescription:
      "A fixed liquid progress indicator — the component never moves, wheel/touch input drives the fill.",
    fullDescription:
      "A self-contained progress indicator: the component stays visually fixed in place while wheel or touch input drives a virtual progress value — filling the pipe, connectors, and stacked cards in sequence, with glass-morphism styling and animated bubbles.",
    icon: "Droplets",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/liquid-scroll-progress.json",
    importStatement: `import { LiquidScrollProgress } from "@/components/liquid-scroll-progress"`,
    usageJsx: "<LiquidScrollProgress />",
    props: [
      { property: "sections", type: "LiquidScrollProgressSection[]", default: "DEFAULT_SECTIONS", description: "Array of { title } — one per card, filled in order as progress advances." },
      { property: "liquidColor", type: "string", default: `"#159cff"`, description: "CSS color used for the liquid fill (pipe, connectors, and cards)." },
      { property: "className", type: "string", default: "-", description: "Additional classes applied to the outer section." },
    ],
    previewCode: `import { LiquidScrollProgress } from "@/components/liquid-scroll-progress";

export default function LiquidScrollProgressPreview() {
  return <LiquidScrollProgress />;
}
`,
    sourceCode: `"use client";

import * as React from "react";

type LiquidScrollProgressSection = {
  title: string;
};

type LiquidScrollProgressProps = {
  sections?: LiquidScrollProgressSection[];
  liquidColor?: string;
  className?: string;
};

const DEFAULT_SECTIONS: LiquidScrollProgressSection[] = [
  { title: "Introduction" },
  { title: "Implementation" },
  { title: "Customization" },
  { title: "Usage" },
];

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const PIPE_LEFT = 4;
const PIPE_W = 6;
const GAP = 22;
const TUCK_INTO_CARD = 4;

/**
 * How much wheel/touch travel (in px-equivalent units) corresponds to
 * going from 0% to 100% progress. Lower = more sensitive (reaches full
 * faster per notch of scroll); higher = less sensitive. Purely a feel
 * knob — not tied to any real scrollable height, since nothing here
 * actually scrolls.
 */
const VIRTUAL_SCROLL_RANGE = 600;

export function LiquidScrollProgress({
  sections = DEFAULT_SECTIONS,
  liquidColor = "#159cff",
  className = "",
}: LiquidScrollProgressProps) {
  const pipeLiquidRef = React.useRef<HTMLDivElement | null>(null);
  const connectorLiquidRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const cardLiquidRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const contentRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  // The fixed, non-scrolling "capture" box. It never scrolls — it only
  // listens for wheel/touch input and turns that into a virtual
  // progress value below. The component's own DOM never moves.
  const captureRef = React.useRef<HTMLDivElement | null>(null);

  // Virtual progress, 0–1. This replaces \`window.scrollY\` /
  // \`container.scrollTop\` entirely — there is no real scroll position
  // anywhere in this component anymore, just this one number that wheel
  // and touch input nudge up or down.
  const progressRef = React.useRef(0);

  connectorLiquidRefs.current = [];
  cardLiquidRefs.current = [];
  contentRefs.current = [];

  React.useEffect(() => {
    if (sections.length === 0) return;

    const capture = captureRef.current;
    if (!capture) return;

    let frame = 0;
    const total = sections.length;

    // Paints the DOM from whatever progressRef.current currently is.
    // Same fill formulas as before — only the source of \`overall\`
    // changed (a plain number we control, not a scroll measurement).
    const paint = () => {
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const overall = progressRef.current;

        if (pipeLiquidRef.current) {
          pipeLiquidRef.current.style.transform = \`scaleY(\${overall})\`;
        }

        for (let i = 0; i < total; i++) {
          const start = i / total;
          const end = (i + 1) / total;
          const raw = clamp((overall - start) / (end - start));
          const connectorFill = clamp(raw / 0.35);
          const cardFill = clamp((raw - 0.1) / 0.9);
          const isFilled = cardFill >= 0.45;

          const connectorEl = connectorLiquidRefs.current[i];
          if (connectorEl) connectorEl.style.transform = \`scaleX(\${connectorFill})\`;

          const cardEl = cardLiquidRefs.current[i];
          if (cardEl) cardEl.style.transform = \`scaleY(\${cardFill})\`;

          const contentEl = contentRefs.current[i];
          if (contentEl) contentEl.classList.toggle("is-filled", isFilled);
        }
      });
    };

    // Wheel: the primary input. preventDefault + stopPropagation stop
    // both the native page scroll AND any smooth-scroll library (e.g.
    // Lenis) upstream from ever seeing this event — nothing scrolls,
    // anywhere, as a result of this gesture.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      progressRef.current = clamp(progressRef.current + e.deltaY / VIRTUAL_SCROLL_RANGE);
      paint();
    };

    // Touch: same idea, tracked manually since there's no native scroll
    // to read a position from.
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const currentY = e.touches[0].clientY;
      const deltaY = touchY - currentY;
      touchY = currentY;
      progressRef.current = clamp(progressRef.current + deltaY / VIRTUAL_SCROLL_RANGE);
      paint();
    };

    paint(); // initial paint at progress = 0

    capture.addEventListener("wheel", onWheel, { passive: false });
    capture.addEventListener("touchstart", onTouchStart, { passive: true });
    capture.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      capture.removeEventListener("wheel", onWheel);
      capture.removeEventListener("touchstart", onTouchStart);
      capture.removeEventListener("touchmove", onTouchMove);
    };
  }, [sections.length]);

  if (sections.length === 0) return null;

  return (
    // Fixed viewport / input capture area. \`overflow: hidden\` with no
    // scrollable content inside means there is nothing to scroll and
    // therefore nothing that can ever show a scrollbar. \`touchAction:
    // "none"\` stops the browser's own touch-scroll gesture from
    // starting before our touchmove handler even runs. \`data-lenis-
    // prevent\` is a second line of defense for the Lenis smooth-scroll
    // library specifically, on top of the stopPropagation() above.
    <div
      ref={captureRef}
      data-lenis-prevent
      className="flex h-full w-full items-center justify-center"
      style={{
        overflow: "hidden",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <section
        aria-label="Scroll progress"
        className={\`relative mx-auto w-full max-w-xs px-2 py-4 sm:px-3 \${className}\`}
      >
        <style>{\`
          .lsp-glass {
            border: 1px solid rgba(148,163,184,0.35);
            background: rgba(255,255,255,0.6);
            backdrop-filter: blur(8px);
            box-shadow:
              inset 1px 0 1px rgba(255,255,255,0.9),
              inset -1px 0 1px rgba(15,23,42,0.08),
              0 1px 3px rgba(15,23,42,0.08);
          }
          .lsp-liquid-h {
            background: linear-gradient(
              90deg,
              color-mix(in srgb, var(--lsp-color) 68%, white 32%) 0%,
              color-mix(in srgb, var(--lsp-color) 58%, white 42%) 65%,
              rgba(255,255,255,0.7) 100%
            );
            box-shadow:
              0 0 4px color-mix(in srgb, var(--lsp-color) 35%, transparent),
              inset 0 1px 1px rgba(255,255,255,0.5);
          }
          .lsp-liquid {
            background: linear-gradient(
              180deg,
              rgba(255,255,255,0.65) 0%,
              color-mix(in srgb, var(--lsp-color) 50%, white 50%) 22%,
              color-mix(in srgb, var(--lsp-color) 68%, white 32%) 100%
            );
            box-shadow:
              0 0 5px color-mix(in srgb, var(--lsp-color) 35%, transparent),
              inset 1px 0 1px rgba(255,255,255,0.6);
          }
          .lsp-content { color: #0f172a; transition: color 300ms ease; }
          .lsp-content.is-filled { color: #fff; }
          .lsp-title {
            font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-weight: 500;
            letter-spacing: 0.06em;
            line-height: 1;
          }
          @keyframes liquid-scroll-bubble-mini {
            0%   { transform: translate3d(0, 3px, 0) scale(0.7); opacity: 0; }
            15%  { opacity: 0.7; }
            70%  { opacity: 0.45; }
            100% { transform: translate3d(var(--bubble-drift, 0px), -34px, 0) scale(1); opacity: 0; }
          }
          @keyframes liquid-scroll-wave {
            0%, 100% { transform: translateX(-2%) scaleX(1); }
            50%      { transform: translateX(2%) scaleX(1.03); }
          }
          @keyframes liquid-scroll-shimmer {
            0%   { transform: translateX(-120%); }
            100% { transform: translateX(120%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .liquid-scroll-motion { animation: none !important; }
          }
        \`}</style>

        <div
          className="relative w-full"
          style={{ paddingLeft: GAP, "--lsp-color": liquidColor } as React.CSSProperties}
        >
          <div
            aria-hidden="true"
            className="absolute bottom-0 top-0 z-20"
            style={{ left: PIPE_LEFT, width: PIPE_W }}
          >
            <div className="lsp-glass absolute inset-0 rounded-full" />

            <div className="absolute inset-[1.5px] overflow-hidden rounded-full">
              <div
                ref={pipeLiquidRef}
                className="lsp-liquid absolute inset-0 origin-top will-change-transform"
                style={{ transform: "scaleY(0)" }}
              >
                <LiquidBubbles compact />
                <div className="liquid-scroll-motion absolute -left-full top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-[1px] motion-safe:animate-[liquid-scroll-shimmer_2.8s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {sections.map((section, index) => (
              <article key={section.title} className="relative w-full">
                <div
                  className="absolute top-1/2 z-[5] h-[7px] -translate-y-1/2 overflow-hidden rounded-full"
                  style={{
                    left: -(GAP - PIPE_LEFT),
                    width: GAP - PIPE_LEFT + TUCK_INTO_CARD,
                  }}
                >
                  <div aria-hidden="true" className="lsp-glass absolute inset-0 rounded-full" />
                  <div
                    ref={(node) => {
                      connectorLiquidRefs.current[index] = node;
                    }}
                    aria-hidden="true"
                    className="lsp-liquid-h absolute inset-y-0 left-0 w-full origin-left will-change-transform"
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>

                <div className="relative z-20 w-[180px] max-w-full h-[48px] overflow-hidden rounded-none border border-slate-300/40 bg-white/[0.7] shadow-[0_4px_10px_rgba(20,40,60,0.08),inset_0_1px_rgba(255,255,255,0.9)] backdrop-blur-xl">
                  <div
                    ref={(node) => {
                      cardLiquidRefs.current[index] = node;
                    }}
                    aria-hidden="true"
                    className="lsp-liquid absolute inset-x-0 bottom-0 top-0 origin-bottom overflow-hidden will-change-transform"
                    style={{ transform: "scaleY(0)" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-200/40 via-transparent to-sky-400/20" />
                    <div className="liquid-scroll-motion absolute -left-[5%] -top-[2px] h-1.5 w-[110%] rounded-[50%] bg-white/35 blur-[1px] motion-safe:animate-[liquid-scroll-wave_2.8s_ease-in-out_infinite]" />
                    <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/15 to-transparent" />
                    <LiquidBubbles />
                    <div className="liquid-scroll-motion absolute -left-full top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm motion-safe:animate-[liquid-scroll-shimmer_3.5s_ease-in-out_infinite]" />
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-none border border-white/60 shadow-[inset_0_1px_rgba(255,255,255,0.85),inset_0_-1px_rgba(15,23,42,0.04)]"
                  />

                  <div
                    ref={(node) => {
                      contentRefs.current[index] = node;
                    }}
                    className="lsp-content relative z-10 flex h-full w-full items-center justify-center px-3 text-center"
                  >
                    <span className="lsp-title truncate uppercase text-[14px] font-medium">
                      {section.title}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function LiquidBubbles({ compact = false }: { compact?: boolean }) {
  const bubbles = compact
    ? [
        { left: "35%", size: 1, duration: "2.4s", delay: "0s", drift: "-1px" },
        { left: "65%", size: 1, duration: "3s", delay: "0.6s", drift: "1px" },
      ]
    : [
        { left: "20%", size: 1.5, duration: "2.6s", delay: "0s", drift: "-1px" },
        { left: "50%", size: 2, duration: "3.2s", delay: "0.7s", drift: "1px" },
        { left: "78%", size: 1.5, duration: "2.9s", delay: "1.3s", drift: "-1px" },
      ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {bubbles.map((bubble, index) => (
        <span
          key={index}
          className="liquid-scroll-motion absolute bottom-0 rounded-full bg-white/60 shadow-[0_0_3px_rgba(255,255,255,0.65)]"
          style={
            {
              left: bubble.left,
              width: \`\${bubble.size}px\`,
              height: \`\${bubble.size}px\`,
              "--bubble-drift": bubble.drift,
              animation: \`liquid-scroll-bubble-mini \${bubble.duration} ease-in \${bubble.delay} infinite\`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default LiquidScrollProgress;
`,
  },


  {
    slug: "jelly-toolbar",
    name: "Jelly Toolbar",
    cardDescription:
      "A floating toolbar with a solid jelly/slime blob that stretches and morphs between items as you move your cursor.",
    fullDescription:
      "A clean, minimal floating toolbar containing a physical jelly/slime element — not a glass blob or hover highlight.",
    icon: "Sparkles",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/jelly-toolbar.json",
    importStatement: `import { JellyToolbar } from "@/components/jelly-toolbar"`,
    usageJsx: "<JellyToolbar />",
    props: [
      { property: "items", type: "JellyToolbarItem[]", default: "6 default items", description: "Array of { label, icon, shortcut?, onSelect? }." },
      { property: "jellyColor", type: "string", default: `"#c4b5fd"`, description: "Jelly color in light mode." },
      { property: "jellyColorDark", type: "string", default: "jellyColor", description: "Jelly color in dark mode. Defaults to jellyColor if omitted." },
      { property: "stiffness", type: "number", default: "380", description: "Spring stiffness for jelly movement — higher is snappier." },
      { property: "damping", type: "number", default: "critical damping (≈39 at default stiffness)", description: "Spring damping for jelly position. Internally floored at the critically-damped value for the given stiffness, so overshoot is never possible even if a lower number is passed." },
      { property: "enableShortcuts", type: "boolean", default: "true", description: "Whether pressing an item's shortcut key activates it globally." },
      { property: "className", type: "string", default: "-", description: "Additional classes applied to the outer wrapper." },
    ],
    previewCode: `import { JellyToolbar } from "@/components/jelly-toolbar";
  
  export default function JellyToolbarPreview() {
    return <JellyToolbar />;
  }
  `,
    sourceCode: `"use client";
  
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
    // If the caller passes an explicit \`damping\`, we still floor it at the
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
        className={\`relative mx-auto flex w-full flex-col items-center \${className}\`}
        // Mobile: unchanged — width is still fully driven by
        // calc(100vw - 32px) exactly as before, and on any phone-width
        // viewport that value sits well below 340px, so this min() only
        // ever bites on desktop. Height: the tooltip row keeps its
        // \`sm:h-7\` desktop-only shrink (mobile stays h-9), while the pill
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
                    className={\`transition-colors duration-200 \${
                      isActive
                        ? "text-violet-700 dark:text-violet-200"
                        : "text-neutral-500 dark:text-neutral-400"
                    }\`}
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
  `,
  },
];

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return components.find((c) => c.slug === slug);
}
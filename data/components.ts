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
    previewCode: `"use client";

import { useState } from "react";
import { DragDropReorder } from "@/components/drag-drop-reorder";
import type { ReorderItem } from "@/components/drag-drop-reorder";
import { Image, Code2, TerminalSquare, CloudUpload, RefreshCw } from "lucide-react";

const initialItems: ReorderItem[] = [
  { id: "design", title: "Design", description: "Create beautiful experiences", icon: Image, color: "pink" },
  { id: "develop", title: "Develop", description: "Build with modern tools", icon: Code2, color: "blue" },
  { id: "test", title: "Test", description: "Ensure everything works", icon: TerminalSquare, color: "neutral" },
  { id: "deploy", title: "Deploy", description: "Launch to the world", icon: CloudUpload, color: "violet" },
  { id: "iterate", title: "Iterate", description: "Make it better", icon: RefreshCw, color: "orange" },
];

export default function DragDropReorderPreview() {
  const [items, setItems] = useState<ReorderItem[]>(initialItems);

  return (
    <div className="flex w-full items-center justify-center p-4">
      <DragDropReorder items={items} onReorder={setItems} />
    </div>
  );
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
  type LucideIcon,
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
    previewCode: `"use client";
  
    import { JellyToolbar, type JellyToolbarItem } from "@/components/jelly-toolbar";
    import {
      MessageSquare,
      Inbox,
      Settings,
      Eye,
      Send,
      Menu as MenuIcon,
    } from "lucide-react";
    
    const items: JellyToolbarItem[] = [
      { label: "Chat", icon: MessageSquare, shortcut: "C" },
      { label: "Inbox", icon: Inbox, shortcut: "I" },
      { label: "Settings", icon: Settings, shortcut: "S" },
      { label: "Preview", icon: Eye, shortcut: "P" },
      { label: "Send", icon: Send, shortcut: "E" },
      { label: "Menu", icon: MenuIcon, shortcut: "M" },
    ];
    
    export default function JellyToolbarPreview() {
      return <JellyToolbar items={items} />;
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






  {
    slug: "pagination",
    name: "Pagination",
    cardDescription:
      "Four pagination styles — Pills, Outline, Compact, With Input — sharing one page state with a sliding active-page indicator.",
    fullDescription:
      "A self-contained pagination component with four visual variants, each independently functional. Every variant smoothly animates its active-page highlight with Framer Motion. Render all four stacked, or a single variant via the variant prop.",
    icon: "ChevronsRightLeft",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/pagination.json",
    importStatement: `import Pagination from "@/components/pagination"`,
    usageJsx: "<Pagination />",
    props: [
      { property: "totalPages", type: "number", default: "40", description: "Total number of pages." },
      { property: "page", type: "number", default: "-", description: "Controlled current page (1-indexed). Pass with onPageChange." },
      { property: "defaultPage", type: "number", default: "1", description: "Uncontrolled initial page. Ignored if page is provided." },
      { property: "onPageChange", type: "function", default: "-", description: "Called whenever the page changes, from any variant." },
      { property: "variant", type: `"pills" | "outline" | "compact" | "input"`, default: "all four", description: "Render only this single variant instead of the full four-row demo." },
      { property: "showInput", type: "boolean", default: "true", description: "Show the \"Go to page\" input on the input variant." },
      { property: "disabled", type: "boolean", default: "false", description: "Disable every control in every rendered variant." },
      { property: "siblingCount", type: "number", default: "2", description: "How many pages to show on each side of the current page." },
      { property: "className", type: "string", default: "-", description: "Extra classes applied to the outermost wrapper." },
    ],
    previewCode: `import Pagination from "@/components/pagination";

export default function PaginationPreview() {
  return <Pagination />;
}
`,
    sourceCode: `"use client"

import * as React from "react"
import { motion, LayoutGroup, type Transition } from "framer-motion"

const h = React.createElement

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ")
}

export type PaginationVariant = "pills" | "outline" | "compact" | "input"

export interface PaginationProps {
  totalPages?: number
  page?: number
  defaultPage?: number
  initialPage?: number
  onPageChange?: (page: number) => void
  variant?: PaginationVariant
  showInput?: boolean
  disabled?: boolean
  siblingCount?: number
  className?: string
}

type PageItem = number | "ellipsis"

function getPageRange(
  current: number,
  total: number,
  siblingCount: number,
  boundaryCount: number
): PageItem[] {
  const safeTotal = Math.max(1, Math.floor(total))
  const safeCurrent = Math.min(Math.max(1, Math.floor(current)), safeTotal)
  const safeSiblingCount = Math.max(0, Math.floor(siblingCount))
  const safeBoundaryCount = Math.max(0, Math.floor(boundaryCount))
  const clamp = (n: number) => Math.min(Math.max(n, 1), safeTotal)

  const visible = new Set<number>()
  for (let i = 1; i <= Math.min(safeBoundaryCount, safeTotal); i++) visible.add(i)
  for (let i = Math.max(safeTotal - safeBoundaryCount + 1, 1); i <= safeTotal; i++) visible.add(i)
  for (let i = clamp(safeCurrent - safeSiblingCount); i <= clamp(safeCurrent + safeSiblingCount); i++) {
    visible.add(i)
  }
  visible.add(1)
  visible.add(safeTotal)

  const sorted = Array.from(visible).sort((a, b) => a - b)
  const items: PageItem[] = []

  sorted.forEach((num, idx) => {
    if (idx > 0) {
      const prev = sorted[idx - 1]
      const gap = num - prev
      if (gap === 2) {
        items.push(prev + 1)
      } else if (gap > 2) {
        items.push("ellipsis")
      }
    }
    items.push(num)
  })

  return items
}

function usePageWindow(
  page: number,
  totalPages: number,
  siblingCount: number,
  isCompact: boolean
): PageItem[] {
  const effectiveSibling = isCompact ? Math.min(siblingCount, 1) : siblingCount
  return React.useMemo(
    () => getPageRange(page, totalPages, effectiveSibling, 1),
    [page, totalPages, effectiveSibling]
  )
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener("change", listener)
    return () => query.removeEventListener("change", listener)
  }, [])

  return reduced
}

function useIsCompactViewport(breakpointPx = 480): boolean {
  const [isCompact, setIsCompact] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia(\`(max-width: \${breakpointPx}px)\`)
    setIsCompact(query.matches)
    const listener = (event: MediaQueryListEvent) => setIsCompact(event.matches)
    query.addEventListener("change", listener)
    return () => query.removeEventListener("change", listener)
  }, [breakpointPx])

  return isCompact
}

function useIndicatorTransition(): Transition {
  const reducedMotion = usePrefersReducedMotion()
  if (reducedMotion) return { duration: 0 }
  return { type: "spring", stiffness: 500, damping: 40, mass: 0.8 }
}

function usePaginationState({
  totalPages,
  page: controlledPage,
  defaultPage,
  onPageChange,
}: {
  totalPages: number
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
}) {
  const isControlled = controlledPage !== undefined
  const [internalPage, setInternalPage] = React.useState(defaultPage ?? 1)
  const page = isControlled ? (controlledPage as number) : internalPage

  const setPage = React.useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 1), Math.max(1, totalPages))
      if (!isControlled) setInternalPage(clamped)
      onPageChange?.(clamped)
    },
    [isControlled, totalPages, onPageChange]
  )

  return [page, setPage] as const
}

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return h(
    "svg",
    { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", ...props },
    h("path", {
      d: "M15 6l-6 6 6 6",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  )
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return h(
    "svg",
    { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", ...props },
    h("path", {
      d: "M9 6l6 6-6 6",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  )
}

interface VariantProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  disabled?: boolean
  siblingCount: number
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"

const interactiveCursor = "cursor-pointer disabled:cursor-not-allowed"

function renderEllipsis(tag: "li" | "span", key: string, className: string) {
  return h(tag, { key, className }, "\\u2026")
}

function PillsPagination({ page, totalPages, onChange, disabled, siblingCount }: VariantProps) {
  const transition = useIndicatorTransition()
  const isCompact = useIsCompactViewport()
  const items = usePageWindow(page, totalPages, siblingCount, isCompact)

  const prevButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Previous page",
      disabled: disabled || page <= 1,
      onClick: () => onChange(page - 1),
      className: cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-neutral-500 shadow-sm ring-1 ring-black/5 transition-colors",
        "max-[480px]:h-9 max-[480px]:w-9",
        "hover:text-neutral-900 disabled:opacity-40 disabled:hover:text-neutral-500",
        "dark:bg-neutral-800 dark:text-neutral-400 dark:ring-white/10 dark:hover:text-white",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronLeftIcon, { className: "h-4 w-4" })
  )

  const nextButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Next page",
      disabled: disabled || page >= totalPages,
      onClick: () => onChange(page + 1),
      className: cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-neutral-500 shadow-sm ring-1 ring-black/5 transition-colors",
        "max-[480px]:h-9 max-[480px]:w-9",
        "hover:text-neutral-900 disabled:opacity-40 disabled:hover:text-neutral-500",
        "dark:bg-neutral-800 dark:text-neutral-400 dark:ring-white/10 dark:hover:text-white",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronRightIcon, { className: "h-4 w-4" })
  )

  const numberItems = items.map((item, index) => {
    if (item === "ellipsis") {
      return renderEllipsis(
        "li",
        \`ellipsis-\${index}\`,
        "grid h-9 w-5 shrink-0 place-items-center text-sm text-neutral-400 max-[480px]:h-8 max-[480px]:w-4 max-[480px]:text-xs dark:text-neutral-500"
      )
    }
    const isActive = item === page
    return h(
      "li",
      { key: item, className: "shrink-0" },
      h(
        "button",
        {
          type: "button",
          disabled: disabled,
          "aria-current": isActive ? "page" : undefined,
          "aria-label": \`Go to page \${item}\`,
          onClick: () => onChange(item),
          className: cn(
            "relative grid h-9 w-9 place-items-center rounded-full text-sm font-medium transition-colors max-[480px]:h-8 max-[480px]:w-8 max-[480px]:text-xs",
            isActive ? "text-white" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700/60",
            interactiveCursor,
            focusRing
          ),
        },
        isActive &&
          h(motion.span, {
            layoutId: "pills-active",
            transition,
            className: "absolute inset-0 rounded-full bg-indigo-600",
          }),
        h("span", { className: "relative z-10" }, item)
      )
    )
  })

  const numbersList = h(
    "ul",
    {
      className:
        "flex shrink-0 items-center gap-1 overflow-hidden rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-black/5 max-[480px]:gap-0.5 max-[480px]:px-2 max-[480px]:py-1 dark:bg-neutral-800 dark:ring-white/10",
    },
    numberItems
  )

  const group = h(
    "div",
    { className: "inline-flex max-w-full items-center gap-3 max-[480px]:gap-1.5" },
    prevButton,
    numbersList,
    nextButton
  )

  return h("nav", { "aria-label": "Pagination", className: "flex w-full items-center justify-center" }, group)
}

function OutlinePagination({ page, totalPages, onChange, disabled, siblingCount }: VariantProps) {
  const transition = useIndicatorTransition()
  const isCompact = useIsCompactViewport()
  const items = usePageWindow(page, totalPages, siblingCount, isCompact)

  const prevButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Previous page",
      disabled: disabled || page <= 1,
      onClick: () => onChange(page - 1),
      className: cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-indigo-600 transition-colors max-[480px]:h-7 max-[480px]:w-7",
        "hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent",
        "dark:text-indigo-400 dark:hover:bg-indigo-500/10",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronLeftIcon, { className: "h-4 w-4" })
  )

  const nextButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Next page",
      disabled: disabled || page >= totalPages,
      onClick: () => onChange(page + 1),
      className: cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-indigo-600 transition-colors max-[480px]:h-7 max-[480px]:w-7",
        "hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent",
        "dark:text-indigo-400 dark:hover:bg-indigo-500/10",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronRightIcon, { className: "h-4 w-4" })
  )

  const numberItems = items.map((item, index) => {
    if (item === "ellipsis") {
      return renderEllipsis(
        "span",
        \`ellipsis-\${index}\`,
        "grid h-8 w-5 shrink-0 place-items-center text-sm text-neutral-400 max-[480px]:h-7 max-[480px]:w-4 max-[480px]:text-xs dark:text-neutral-500"
      )
    }
    const isActive = item === page
    return h(
      "button",
      {
        key: item,
        type: "button",
        disabled: disabled,
        "aria-current": isActive ? "page" : undefined,
        "aria-label": \`Go to page \${item}\`,
        onClick: () => onChange(item),
        className: cn(
          "relative grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-medium transition-colors max-[480px]:h-7 max-[480px]:w-7 max-[480px]:text-xs",
          isActive
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
          interactiveCursor,
          focusRing
        ),
      },
      isActive &&
        h(motion.span, {
          layoutId: "outline-active",
          transition,
          className: "absolute inset-0 rounded-lg ring-2 ring-indigo-600 dark:ring-indigo-400",
        }),
      h("span", { className: "relative z-10" }, item)
    )
  })

  const numbersRow = h("div", { className: "flex shrink-0 items-center gap-1 py-0.5" }, numberItems)

  const box = h(
    "div",
    {
      className: cn(
        "box-border inline-flex max-w-full items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-8 py-2 shadow-sm",
        "max-[480px]:gap-1 max-[480px]:px-2 max-[480px]:py-2",
        "dark:border-neutral-800 dark:bg-neutral-900"
      ),
    },
    prevButton,
    numbersRow,
    nextButton
  )

  return h("nav", { "aria-label": "Pagination", className: "flex w-full items-center justify-center" }, box)
}

function CompactPagination({ page, totalPages, onChange, disabled, siblingCount }: VariantProps) {
  const transition = useIndicatorTransition()
  const isCompact = useIsCompactViewport()
  const items = usePageWindow(page, totalPages, siblingCount, isCompact)

  const numberItems = items.map((item, index) => {
    if (item === "ellipsis") {
      return renderEllipsis(
        "li",
        \`ellipsis-\${index}\`,
        "grid h-7 w-4 shrink-0 place-items-center text-xs text-neutral-400 dark:text-neutral-500"
      )
    }
    const isActive = item === page
    return h(
      "li",
      { key: item, className: "shrink-0" },
      h(
        "button",
        {
          type: "button",
          disabled: disabled,
          "aria-current": isActive ? "page" : undefined,
          "aria-label": \`Go to page \${item}\`,
          onClick: () => onChange(item),
          className: cn(
            "relative grid h-7 w-7 place-items-center rounded-md text-xs font-medium transition-colors max-[480px]:h-6 max-[480px]:w-6",
            isActive ? "text-white" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
            interactiveCursor,
            focusRing
          ),
        },
        isActive &&
          h(motion.span, {
            layoutId: "compact-active",
            transition,
            className: "absolute inset-0 rounded-md bg-indigo-600",
          }),
        h("span", { className: "relative z-10" }, item)
      )
    )
  })

  const numbersList = h("ul", { className: "flex shrink-0 items-center gap-1" }, numberItems)

  const prevButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Previous page",
      disabled: disabled || page <= 1,
      onClick: () => onChange(page - 1),
      className: cn(
        "grid h-7 w-7 place-items-center rounded-md bg-neutral-100 text-neutral-500 transition-colors max-[480px]:h-6 max-[480px]:w-6",
        "hover:text-neutral-900 disabled:opacity-40 disabled:hover:text-neutral-500",
        "dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-white",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronLeftIcon, { className: "h-3.5 w-3.5" })
  )

  const nextButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Next page",
      disabled: disabled || page >= totalPages,
      onClick: () => onChange(page + 1),
      className: cn(
        "grid h-7 w-7 place-items-center rounded-md bg-indigo-600 text-white transition-colors max-[480px]:h-6 max-[480px]:w-6",
        "hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronRightIcon, { className: "h-3.5 w-3.5" })
  )

  const controls = h("div", { className: "flex shrink-0 items-center gap-1" }, prevButton, nextButton)

  const box = h(
    "div",
    {
      className: cn(
        "box-border inline-flex max-w-full items-center gap-5 rounded-xl border border-neutral-200 bg-white px-3 py-2 shadow-sm",
        "max-[480px]:gap-3 max-[480px]:px-2 max-[480px]:py-1.5",
        "dark:border-neutral-800 dark:bg-neutral-900"
      ),
    },
    numbersList,
    controls
  )

  return h("nav", { "aria-label": "Pagination", className: "flex w-full items-center justify-center" }, box)
}

function InputPagination({
  page,
  totalPages,
  onChange,
  disabled,
  siblingCount,
  showInput = true,
}: VariantProps & { showInput?: boolean }) {
  const transition = useIndicatorTransition()
  const isCompact = useIsCompactViewport()
  const items = usePageWindow(page, totalPages, siblingCount, isCompact)
  const [inputValue, setInputValue] = React.useState("")
  const inputId = React.useId()

  const submitGoTo = () => {
    const parsed = Number.parseInt(inputValue, 10)
    if (Number.isNaN(parsed)) {
      setInputValue("")
      return
    }
    const clamped = Math.min(Math.max(parsed, 1), totalPages)
    onChange(clamped)
    setInputValue("")
  }

  const prevButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Previous page",
      disabled: disabled || page <= 1,
      onClick: () => onChange(page - 1),
      className: cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-neutral-500 transition-colors",
        "hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent",
        "dark:text-neutral-400 dark:hover:bg-neutral-800",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronLeftIcon, { className: "h-4 w-4" })
  )

  const nextButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Next page",
      disabled: disabled || page >= totalPages,
      onClick: () => onChange(page + 1),
      className: cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-neutral-500 transition-colors",
        "hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent",
        "dark:text-neutral-400 dark:hover:bg-neutral-800",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronRightIcon, { className: "h-4 w-4" })
  )

  const numberItems = items.map((item, index) => {
    if (item === "ellipsis") {
      return renderEllipsis(
        "li",
        \`ellipsis-\${index}\`,
        "grid h-8 w-4 shrink-0 place-items-center text-sm text-neutral-400 max-[480px]:h-7 max-[480px]:text-xs dark:text-neutral-500"
      )
    }
    const isActive = item === page
    return h(
      "li",
      { key: item, className: "shrink-0" },
      h(
        "button",
        {
          type: "button",
          disabled: disabled,
          "aria-current": isActive ? "page" : undefined,
          "aria-label": \`Go to page \${item}\`,
          onClick: () => onChange(item),
          className: cn(
            "relative grid h-8 w-8 place-items-center rounded-lg text-sm font-medium transition-colors max-[480px]:h-7 max-[480px]:w-7 max-[480px]:text-xs",
            isActive ? "text-white" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
            interactiveCursor,
            focusRing
          ),
        },
        isActive &&
          h(motion.span, {
            layoutId: "input-active",
            layout: true,
            transition,
            style: { rotate: 45 },
            className: "absolute inset-1 rounded-md bg-indigo-600",
          }),
        h("span", { className: "relative z-10" }, item)
      )
    )
  })

  const numbersList = h("ul", { className: "flex shrink-0 items-center gap-1 px-0.5" }, numberItems)

  const nav = h(
    "nav",
    {
      "aria-label": "Pagination",
      className: "inline-flex shrink-0 items-center gap-1 max-[480px]:w-full max-[480px]:justify-center",
    },
    prevButton,
    numbersList,
    nextButton
  )

  const goToForm = showInput
    ? h(
        "form",
        {
          className: "inline-flex shrink-0 items-center gap-2 max-[480px]:w-full max-[480px]:justify-center",
          onSubmit: (event: React.FormEvent) => {
            event.preventDefault()
            submitGoTo()
          },
        },
        h(
          "label",
          {
            htmlFor: inputId,
            className: "whitespace-nowrap text-sm text-neutral-500 max-[480px]:text-xs dark:text-neutral-400",
          },
          "Go to page"
        ),
        h("input", {
          id: inputId,
          type: "text",
          inputMode: "numeric",
          disabled: disabled,
          value: inputValue,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(event.target.value.replace(/[^0-9]/g, "")),
          placeholder: String(page),
          className: cn(
            "h-8 w-14 shrink-0 rounded-lg border border-neutral-200 bg-white px-2 text-center text-sm text-neutral-800 transition-colors max-[480px]:h-7 max-[480px]:w-11 max-[480px]:text-xs",
            "placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100",
            focusRing
          ),
        }),
        h(
          "button",
          {
            type: "submit",
            disabled: disabled || inputValue === "",
            className: cn(
              "flex h-8 shrink-0 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white transition-colors max-[480px]:h-7 max-[480px]:px-2 max-[480px]:text-xs",
              "hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600",
              interactiveCursor,
              focusRing
            ),
          },
          "Go",
          h(ChevronRightIcon, { className: "h-3.5 w-3.5" })
        )
      )
    : null

  const box = h(
    "div",
    {
      className: cn(
        "box-border flex max-w-full flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 shadow-sm",
        "min-[481px]:w-fit min-[481px]:flex-row min-[481px]:gap-4 min-[481px]:rounded-full min-[481px]:py-2",
        "max-[480px]:w-full",
        "dark:border-neutral-800 dark:bg-neutral-900"
      ),
    },
    nav,
    goToForm
  )

  return h("div", { className: "flex w-full items-center justify-center" }, box)
}

function PaginationInstance({
  variant,
  totalPages,
  initialPage,
  siblingCount,
  disabled,
  showInput,
}: {
  variant: PaginationVariant
  totalPages: number
  initialPage: number
  siblingCount: number
  disabled?: boolean
  showInput?: boolean
}) {
  const groupId = React.useId()
  const [page, setPage] = usePaginationState({ totalPages, defaultPage: initialPage })
  const shared: VariantProps = { page, totalPages, onChange: setPage, disabled, siblingCount }

  let content: React.ReactNode = null
  if (variant === "pills") content = h(PillsPagination, shared)
  else if (variant === "outline") content = h(OutlinePagination, shared)
  else if (variant === "compact") content = h(CompactPagination, shared)
  else if (variant === "input") content = h(InputPagination, { ...shared, showInput: showInput ?? true })

  return h(LayoutGroup, { id: \`pagination-\${variant}-\${groupId}\` }, content)
}

export default function Pagination({
  totalPages = 40,
  page,
  defaultPage,
  initialPage,
  onPageChange,
  variant,
  showInput = true,
  disabled = false,
  siblingCount = 2,
  className,
}: PaginationProps) {
  const singleGroupId = React.useId()
  const [singlePage, setSinglePage] = usePaginationState({
    totalPages,
    page,
    defaultPage: defaultPage ?? initialPage ?? 1,
    onPageChange,
  })

  if (variant) {
    const shared: VariantProps = { page: singlePage, totalPages, onChange: setSinglePage, disabled, siblingCount }
    let content: React.ReactNode = null
    if (variant === "pills") content = h(PillsPagination, shared)
    else if (variant === "outline") content = h(OutlinePagination, shared)
    else if (variant === "compact") content = h(CompactPagination, shared)
    else if (variant === "input") content = h(InputPagination, { ...shared, showInput })

    return h(
      LayoutGroup,
      { id: \`pagination-\${variant}-\${singleGroupId}\` },
      h("div", { className: cn("w-full", className) }, content)
    )
  }

  const seed = defaultPage ?? initialPage ?? 3

  return h(
    "div",
    { className: cn("mx-auto flex w-full max-w-[860px] flex-col gap-7", className) },
    h(PaginationInstance, { variant: "pills", totalPages, initialPage: seed, siblingCount, disabled }),
    h(PaginationInstance, { variant: "outline", totalPages, initialPage: seed, siblingCount, disabled }),
    h(PaginationInstance, { variant: "compact", totalPages, initialPage: seed, siblingCount, disabled }),
    h(PaginationInstance, { variant: "input", totalPages, initialPage: seed, siblingCount, disabled, showInput })
  )
}
`,
  },




  {
    slug: "otp-input",
    name: "OTP Input",
    cardDescription:
      "Four OTP input styles — Classic, Underline, Pill, Filled — each with a spring-driven focus indicator that glides to the exact measured position of the active slot.",
    fullDescription:
      "A self-contained OTP/verification-code input with four independently functional variants (bordered squares, underline, connected capsule, filled tiles). A Framer Motion spring drives the focus indicator between slots using real measured positions.",
    icon: "KeyRound",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/otp-input.json",
    importStatement: `import OtpShowcase, { OtpInput } from "@/components/otp-input"`,
    usageJsx: `<OtpInput length={6} variant="classic" />`,
    props: [
      { property: "length", type: "number", default: "6", description: "Number of OTP digits/slots." },
      { property: "variant", type: `"classic" | "underline" | "pill" | "filled"`, default: "all four", description: "Render only this single variant instead of the full four-card demo." },
      { property: "value", type: "string", default: "-", description: "Controlled value. Pass with onChange to control the input externally." },
      { property: "onChange", type: "function", default: "-", description: "Called with the joined digit string whenever any slot changes." },
      { property: "onComplete", type: "function", default: "-", description: "Called once with the full code when every slot is filled." },
      { property: "disabled", type: "boolean", default: "false", description: "Disable every slot." },
      { property: "autoFocus", type: "boolean", default: "true", description: "Focus the first slot on mount." },
      { property: "theme", type: `"light" | "dark" | "system"`, default: "system", description: "Color theme for borders, digits, and the active indicator." },
      { property: "className", type: "string", default: "-", description: "Extra classes applied to the outermost wrapper." },
    ],
    previewCode: `import OtpShowcase from "@/components/otp-input";

export default function OtpInputPreview() {
  return <OtpShowcase />;
}
`,
    sourceCode: `"use client";

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
type OtpVariant = "classic" | "underline" | "pill" | "filled";

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
      aria-label={\`Digit \${index + 1} of \${length}\`}
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
      const clean = raw.replace(/\\D/g, "");
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
      const text = e.clipboardData.getData("text").replace(/\\D/g, "");
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
              style={i < length - 1 ? { borderRight: \`1px solid \${dividerColor(themeMode)}\` } : undefined}
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

export interface OtpInputProps {
  length?: number;
  variant?: OtpVariant;
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

  const variants: OtpVariant[] = ["classic", "underline", "pill", "filled"];

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
`,
  },



  {
    slug: "buttons",
    name: "Buttons",
    cardDescription:
      "Four animated button interactions — Staggered Letter Lift, Single Liquid Bubble, Magnetic, Cursor Compression — monochrome, independently stateful, and built on identical geometry.",
    fullDescription:
      "A self-contained set of four animated button interactions, each fully independent. Per-letter clip/lift typography, a single continuous liquid fluid that grows across the button and shrinks away in the same direction, cursor-following magnetic pull, and a cursor-driven compression dent that deforms the button's silhouette toward the pointer — all sharing the same button geometry so no animation ever resizes the layout.",
    icon: "MousePointerClick",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/buttons.json",
    importStatement: `import ButtonsShowcase, { AnimatedButton } from "@/components/buttons"`,
    usageJsx: `<AnimatedButton variant="magnetic" />`,
    props: [
      { property: "variant", type: `"letters" | "liquid" | "magnetic" | "compression"`, default: "-", description: "Which single interaction to render." },
      { property: "label", type: "string", default: `"Book a call"`, description: "Button text." },
      { property: "onClick", type: "function", default: "-", description: "Called on click/activation." },
      { property: "theme", type: `"light" | "dark" | "system"`, default: "system", description: "Color theme for the button surface, text, and effects." },
      { property: "className", type: "string", default: "-", description: "Extra classes applied to the outermost element." },
    ],
    previewCode: `import { Buttons, type VariantEntry } from "@/components/buttons";

const variants: VariantEntry[] = [
  { variant: "letters", name: "Staggered Letter Lift" },
  { variant: "liquid", name: "Single Liquid Bubble" },
  { variant: "magnetic", name: "Magnetic" },
  { variant: "compression", name: "Cursor Compression" },
];

export default function ButtonsPreview() {
  return <Buttons variants={variants} />;
}
`,
    sourceCode: `"use client";

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
              <span>{ch === " " ? "\\u00A0" : ch}</span>
              <span>{ch === " " ? "\\u00A0" : ch}</span>
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

const FLUID_DURATION_MS = 700;
const FLUID_HOLD_MS = 200;

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
    width: \`\${widthPct}%\`,
    borderRadius: 9999,
    background: \`radial-gradient(130% 160% at \${anchorLeft ? "28%" : "72%"} 38%, \${colors.liquidCore}, \${colors.liquidEdge})\`,
    boxShadow: \`inset 0 0 0 1px \${colors.liquidStroke}\`,
    transitionProperty: "width",
    transitionDuration: instant ? "0ms" : \`\${FLUID_DURATION_MS}ms\`,
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
        setFrame({ clip: \`path('\${d}')\`, cx, cy, o: Math.min(1, a * 1.3) });
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
            background: \`radial-gradient(circle at \${frame.cx}px \${frame.cy}px, \${colors.dentShadow}, transparent 62%), radial-gradient(circle at \${frame.cx - 4}px \${frame.cy - 5}px, \${colors.dentHighlight}, transparent 30%)\`,
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
`,
  },















  {
    slug: "elastic-dropdown",
    name: "Elastic Dropdown",
    cardDescription:
      "A compact dropdown whose outer shape physically stretches open — one continuous spring-driven SVG surface that bows, overshoots, and settles back into the trigger, not a menu that fades or slides in.",
    fullDescription:
      "A single elastic dropdown whose outline itself deforms open and closed via a mass-spring simulation, with full keyboard, ARIA listbox, and click-outside support.",
    icon: "ChevronsUpDown",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/elastic-dropdown.json",
    importStatement: `import ElasticDropdownShowcase, { ElasticDropdown } from "@/components/elastic-dropdown"`,
    usageJsx: `<ElasticDropdown placeholder="Project" onChange={(value) => console.log(value)} />`,
    props: [
      { property: "options", type: "ElasticDropdownOption[]", default: "Personal / Work / Design / Development", description: "Selectable options, each with a value, label, and optional icon." },
      { property: "value", type: "string", default: "-", description: "Controlled selected value. Pass with onChange to control the dropdown externally." },
      { property: "defaultValue", type: "string", default: "-", description: "Initial selected value for uncontrolled use." },
      { property: "onChange", type: "function", default: "-", description: "Called with the newly selected option's value." },
      { property: "placeholder", type: "string", default: `"Select option"`, description: "Trigger text shown when nothing is selected." },
      { property: "placeholderIcon", type: "IconComponent", default: "FolderIcon", description: "Icon shown next to the placeholder text." },
      { property: "disabled", type: "boolean", default: "false", description: "Disable the trigger and prevent opening." },
      { property: "className", type: "string", default: "-", description: "Extra classes applied to the outermost wrapper." },
    ],
    previewCode: `import ElasticDropdownShowcase from "@/components/elastic-dropdown";

export default function ElasticDropdownPreview() {
  return <ElasticDropdownShowcase />;
}
`,
    sourceCode: `"use client"

/**
 * ElasticDropdown — a compact dropdown whose outer surface physically
 * deforms open and closed: a single continuous SVG path stretches,
 * slightly overshoots, and settles, rather than a menu that fades,
 * slides, or scales in on top of a static trigger.
 *
 * Dependencies: none beyond react. No external icon library — a
 * handful of small inline stroke icons are included below.
 *
 * Exports:
 *   - ElasticDropdown          (named)   → the functional component,
 *                                          fully controllable via props.
 *   - ElasticDropdownShowcase  (default) → demo shell (background,
 *                                          theme toggle, centered).
 */

import * as React from "react"

/* ------------------------------------------------------------------ */
/*  icons — small stroke-only line icons, no external dependency       */
/* ------------------------------------------------------------------ */

export type IconComponent = React.FC

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  "aria-hidden": true,
} as const

export const FolderIcon: IconComponent = () => (
  <svg {...iconProps}>
    <path
      d="M2.5 4.8c0-.72.58-1.3 1.3-1.3h2.6l1.2 1.3h4.6c.72 0 1.3.58 1.3 1.3v5.6c0 .72-.58 1.3-1.3 1.3H3.8c-.72 0-1.3-.58-1.3-1.3V4.8Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
)

export const UserIcon: IconComponent = () => (
  <svg {...iconProps}>
    <circle cx="8" cy="5.6" r="2.3" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M3.4 13c.7-2.4 2.6-3.7 4.6-3.7s3.9 1.3 4.6 3.7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)

export const BriefcaseIcon: IconComponent = () => (
  <svg {...iconProps}>
    <rect x="2.3" y="5.6" width="11.4" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M6.2 5.6V4.3a1.8 1.8 0 0 1 1.8-1.8v0a1.8 1.8 0 0 1 1.8 1.8v1.3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path d="M2.3 9h11.4" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

export const PaletteIcon: IconComponent = () => (
  <svg {...iconProps}>
    <path
      d="M8 2.4a5.6 5.6 0 1 0 0 11.2c.8 0 1.3-.6 1.3-1.2 0-.27-.1-.5-.3-.7-.2-.2-.3-.45-.3-.7 0-.5.5-.9 1-.9h1.1A2.8 2.8 0 0 0 13.6 7c0-2.6-2.5-4.6-5.6-4.6Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="5.4" cy="7.2" r=".6" fill="currentColor" />
    <circle cx="6.7" cy="5" r=".6" fill="currentColor" />
    <circle cx="9.4" cy="5" r=".6" fill="currentColor" />
    <circle cx="10.6" cy="7.2" r=".6" fill="currentColor" />
  </svg>
)

export const CodeIcon: IconComponent = () => (
  <svg {...iconProps}>
    <path
      d="M5.6 4.4 2 8l3.6 3.6M10.4 4.4 14 8l-3.6 3.6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/* ------------------------------------------------------------------ */
/*  public option type + default content                               */
/* ------------------------------------------------------------------ */

export interface ElasticDropdownOption {
  value: string
  label: string
  icon?: IconComponent
}

const DEFAULT_OPTIONS: ElasticDropdownOption[] = [
  { value: "personal", label: "Personal", icon: UserIcon },
  { value: "work", label: "Work", icon: BriefcaseIcon },
  { value: "design", label: "Design", icon: PaletteIcon },
  { value: "development", label: "Development", icon: CodeIcon },
]

/* ------------------------------------------------------------------ */
/*  geometry                                                            */
/* ------------------------------------------------------------------ */

const CLOSED_HEIGHT = 52
const CLOSED_RADIUS = CLOSED_HEIGHT / 2
const OPEN_RADIUS = 18
const BOW_MAX = 9 // px the side edges may bulge/pinch during over/undershoot
const MIN_EXPANDED_HEIGHT = CLOSED_HEIGHT + 100

// Tuned so opening reads as a fast response with a small overshoot and
// a quick settle (~500-600ms total).
const SPRING_STIFFNESS = 210
const SPRING_DAMPING = 23

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** One continuous rounded silhouette whose left/right edges bow
 *  outward (or pinch inward) by \`bow\` px at their vertical midpoint —
 *  the actual outline changes shape, it isn't a scaled rectangle. */
function buildShapePath(width: number, height: number, radius: number, bow: number) {
  const w = Math.max(width, 1)
  const h = Math.max(height, 1)
  const r = Math.min(radius, h / 2, w / 2)
  const midY = h / 2

  return [
    \`M \${r} 0\`,
    \`H \${w - r}\`,
    \`A \${r} \${r} 0 0 1 \${w} \${r}\`,
    \`Q \${w + bow} \${midY} \${w} \${h - r}\`,
    \`A \${r} \${r} 0 0 1 \${w - r} \${h}\`,
    \`H \${r}\`,
    \`A \${r} \${r} 0 0 1 0 \${h - r}\`,
    \`Q \${-bow} \${midY} 0 \${r}\`,
    \`A \${r} \${r} 0 0 1 \${r} 0\`,
    "Z",
  ].join(" ")
}

/* ------------------------------------------------------------------ */
/*  component                                                           */
/* ------------------------------------------------------------------ */

export interface ElasticDropdownProps {
  /** Selectable options. Defaults to Personal / Work / Design / Development. */
  options?: ElasticDropdownOption[]
  /** Controlled selected value — pass with onChange to control externally. */
  value?: string
  /** Initial selected value for uncontrolled use. */
  defaultValue?: string
  /** Called with the newly selected option's value. */
  onChange?: (value: string) => void
  /** Trigger text shown when nothing is selected. */
  placeholder?: string
  /** Icon shown next to the placeholder text. */
  placeholderIcon?: IconComponent
  disabled?: boolean
  className?: string
}

export function ElasticDropdown({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue,
  onChange,
  placeholder = "Select option",
  placeholderIcon: PlaceholderIcon = FolderIcon,
  disabled = false,
  className,
}: ElasticDropdownProps) {
  const reactId = React.useId()
  const listboxId = \`\${reactId}-listbox\`
  const optionId = (i: number) => \`\${reactId}-option-\${i}\`

  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(defaultValue)
  const currentValue = isControlled ? value : uncontrolledValue
  const selectedIndex = options.findIndex((o) => o.value === currentValue)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  const [open, setOpenState] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isFocused, setIsFocused] = React.useState(false)

  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const listRef = React.useRef<HTMLUListElement | null>(null)
  const optionsMeasureRef = React.useRef<HTMLDivElement | null>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)
  const pathRef = React.useRef<SVGPathElement | null>(null)
  const chevronRef = React.useRef<SVGSVGElement | null>(null)
  const optionsWrapRef = React.useRef<HTMLDivElement | null>(null)

  // Animation state lives in refs, not React state — the spring runs
  // every frame and writes directly to the DOM, so nothing re-renders
  // on each tick and the shape never fights a CSS transition.
  const posRef = React.useRef(0)
  const velRef = React.useRef(0)
  const targetRef = React.useRef(0)
  const rafRef = React.useRef<number | null>(null)
  const lastTimeRef = React.useRef<number | null>(null)
  const widthRef = React.useRef(240)
  const expandedHeightRef = React.useRef(MIN_EXPANDED_HEIGHT)
  const openRef = React.useRef(false)
  const reducedMotionRef = React.useRef(false)

  const applyFrame = React.useCallback((pos: number) => {
    const container = rootRef.current
    const svg = svgRef.current
    const path = pathRef.current
    const chevron = chevronRef.current
    const optionsWrap = optionsWrapRef.current
    if (!container || !svg || !path) return

    const width = widthRef.current
    const expandedHeight = expandedHeightRef.current
    const t = clamp(pos, 0, 1)

    const height = clamp(lerp(CLOSED_HEIGHT, expandedHeight, pos), CLOSED_HEIGHT - 4, expandedHeight + 16)
    const radius = lerp(CLOSED_RADIUS, OPEN_RADIUS, t)
    const excess = pos - t // >0 opening overshoot, <0 closing undershoot
    const bow = clamp(excess * 46, -BOW_MAX, BOW_MAX)

    container.style.height = \`\${height}px\`
    svg.setAttribute("viewBox", \`0 0 \${width} \${height}\`)
    svg.setAttribute("width", \`\${width}\`)
    svg.setAttribute("height", \`\${height}\`)
    path.setAttribute("d", buildShapePath(width, height, radius, bow))

    if (chevron) chevron.style.transform = \`rotate(\${t * 180}deg)\`

    if (optionsWrap) {
      const reveal = clamp((t - 0.32) / 0.68, 0, 1)
      optionsWrap.style.opacity = \`\${reveal}\`
      optionsWrap.style.transform = \`translateY(\${(1 - reveal) * 6}px)\`
      optionsWrap.style.pointerEvents = t > 0.6 ? "auto" : "none"
    }
  }, [])

  const tick = React.useCallback(
    (now: number) => {
      const last = lastTimeRef.current ?? now
      const dt = Math.min((now - last) / 1000, 0.064)
      lastTimeRef.current = now

      const target = targetRef.current
      const force = (target - posRef.current) * SPRING_STIFFNESS - velRef.current * SPRING_DAMPING
      velRef.current += force * dt
      posRef.current += velRef.current * dt

      applyFrame(posRef.current)

      const atRest = Math.abs(target - posRef.current) < 0.001 && Math.abs(velRef.current) < 0.001
      if (!atRest) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        posRef.current = target
        velRef.current = 0
        applyFrame(target)
        rafRef.current = null
        lastTimeRef.current = null
        if (target === 0) setMounted(false)
      }
    },
    [applyFrame]
  )

  const runSpring = React.useCallback(
    (target: number) => {
      targetRef.current = target

      if (reducedMotionRef.current) {
        posRef.current = target
        velRef.current = 0
        applyFrame(target)
        if (target === 0) setMounted(false)
        return
      }

      if (rafRef.current == null) {
        lastTimeRef.current = null
        rafRef.current = requestAnimationFrame(tick)
      }
    },
    [applyFrame, tick]
  )

  const measure = React.useCallback(() => {
    if (rootRef.current) {
      widthRef.current = rootRef.current.getBoundingClientRect().width || widthRef.current
    }
    if (optionsMeasureRef.current) {
      const optionsHeight = optionsMeasureRef.current.scrollHeight
      expandedHeightRef.current = Math.max(CLOSED_HEIGHT + optionsHeight, MIN_EXPANDED_HEIGHT)
    }
  }, [])

  const close = React.useCallback(() => {
    setOpenState(false)
    openRef.current = false
    runSpring(0)
    if (rootRef.current?.contains(document.activeElement)) {
      buttonRef.current?.focus()
    }
  }, [runSpring])

  const openMenu = React.useCallback(() => {
    if (disabled) return
    setMounted(true)
    setOpenState(true)
    openRef.current = true
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    requestAnimationFrame(() => {
      measure()
      runSpring(1)
      listRef.current?.focus()
    })
  }, [disabled, measure, runSpring, selectedIndex])

  const toggle = React.useCallback(() => {
    if (disabled) return
    if (openRef.current) close()
    else openMenu()
  }, [close, disabled, openMenu])

  const selectOption = React.useCallback(
    (index: number) => {
      const option = options[index]
      if (!option) return
      if (!isControlled) setUncontrolledValue(option.value)
      onChange?.(option.value)
      close()
    },
    [close, isControlled, onChange, options]
  )

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = mq.matches
    const handler = () => {
      reducedMotionRef.current = mq.matches
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  React.useLayoutEffect(() => {
    measure()
    applyFrame(posRef.current)
    const onResize = () => {
      measure()
      if (rafRef.current == null) applyFrame(posRef.current)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [measure, applyFrame])

  React.useEffect(() => {
    if (mounted) measure()
  }, [mounted, measure])

  React.useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open, close])

  React.useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (open) return
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault()
      openMenu()
    }
  }

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, options.length - 1))
        break
      case "ArrowUp":
        event.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case "Home":
        event.preventDefault()
        setActiveIndex(0)
        break
      case "End":
        event.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case "Enter":
      case " ":
        event.preventDefault()
        selectOption(activeIndex)
        break
      case "Escape":
        event.preventDefault()
        close()
        break
      case "Tab":
        close()
        break
      default:
        break
    }
  }

  const TriggerIcon = selected?.icon ?? PlaceholderIcon
  const triggerLabel = selected ? selected.label : placeholder

  return (
    <div
      className={["elastic-dropdown-root", className].filter(Boolean).join(" ")}
      style={{ width: "min(100%, 260px)" }}
    >
      <style>{\`
        .elastic-dropdown-root {
          --edd-surface: #ffffff;
          --edd-border: rgba(15, 23, 42, 0.10);
          --edd-text: #0f172a;
          --edd-text-muted: #64748b;
          --edd-highlight: rgba(15, 23, 42, 0.045);
          --edd-highlight-strong: rgba(37, 99, 235, 0.10);
          --edd-focus: #2563eb;
          --edd-shadow-1: 0 1px 2px rgba(15, 23, 42, 0.05);
          --edd-shadow-2: 0 10px 24px rgba(15, 23, 42, 0.08);
        }
        @media (prefers-color-scheme: dark) {
          .elastic-dropdown-root {
            --edd-surface: #17191f;
            --edd-border: rgba(255, 255, 255, 0.12);
            --edd-text: #f1f5f9;
            --edd-text-muted: #94a3b8;
            --edd-highlight: rgba(255, 255, 255, 0.06);
            --edd-highlight-strong: rgba(96, 165, 250, 0.16);
            --edd-focus: #60a5fa;
            --edd-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.35);
            --edd-shadow-2: 0 14px 28px rgba(0, 0, 0, 0.45);
          }
        }
        .dark .elastic-dropdown-root {
          --edd-surface: #17191f;
          --edd-border: rgba(255, 255, 255, 0.12);
          --edd-text: #f1f5f9;
          --edd-text-muted: #94a3b8;
          --edd-highlight: rgba(255, 255, 255, 0.06);
          --edd-highlight-strong: rgba(96, 165, 250, 0.16);
          --edd-focus: #60a5fa;
          --edd-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.35);
          --edd-shadow-2: 0 14px 28px rgba(0, 0, 0, 0.45);
        }
        .edd-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 26px;
          transition: box-shadow 200ms ease, transform 200ms ease;
        }
        .edd-container.is-hover-ready:hover {
          transform: translateY(-1px);
        }
        .edd-container.is-focused {
          box-shadow: 0 0 0 2px var(--edd-surface), 0 0 0 4px var(--edd-focus);
        }
        .edd-container.is-disabled {
          opacity: 0.5;
        }
        .edd-shape {
          position: absolute;
          inset: 0;
          display: block;
          filter: drop-shadow(var(--edd-shadow-1)) drop-shadow(var(--edd-shadow-2));
        }
        .edd-shape path {
          fill: var(--edd-surface);
          stroke: var(--edd-border);
          stroke-width: 1px;
        }
        .edd-content {
          position: relative;
          z-index: 1;
          height: 100%;
        }
        .edd-trigger {
          all: unset;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          height: \${CLOSED_HEIGHT}px;
          padding: 0 18px;
          cursor: pointer;
          color: var(--edd-text);
        }
        .edd-trigger:disabled {
          cursor: not-allowed;
        }
        .edd-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          color: var(--edd-text);
        }
        .edd-icon.is-placeholder {
          color: var(--edd-text-muted);
        }
        .edd-value {
          flex: 1;
          min-width: 0;
          text-align: left;
          font-size: 14.5px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .edd-value.is-placeholder {
          color: var(--edd-text-muted);
        }
        .edd-chevron {
          flex-shrink: 0;
          color: var(--edd-text-muted);
          transition: color 150ms ease;
        }
        .edd-options-wrap {
          padding: 4px 8px 10px;
          opacity: 0;
          will-change: opacity, transform;
        }
        .edd-list {
          all: unset;
          display: block;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .edd-option {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          margin: 0 2px;
          border-radius: 12px;
          font-size: 14px;
          color: var(--edd-text);
          cursor: pointer;
          transition: background-color 120ms ease;
        }
        .edd-option .edd-icon {
          color: var(--edd-text-muted);
        }
        .edd-option.is-active {
          background: var(--edd-highlight);
        }
        .edd-option.is-selected {
          background: var(--edd-highlight-strong);
          font-weight: 600;
        }
        .edd-option.is-selected .edd-icon {
          color: var(--edd-text);
        }
        .edd-options-measure {
          position: absolute;
          visibility: hidden;
          pointer-events: none;
          top: 0;
          left: 0;
          width: 100%;
          z-index: -1;
        }
        @media (prefers-reduced-motion: reduce) {
          .edd-container,
          .edd-container.is-hover-ready:hover {
            transition: box-shadow 120ms ease;
            transform: none;
          }
        }
      \`}</style>

      <div
        ref={rootRef}
        className={\`edd-container is-hover-ready\${isFocused ? " is-focused" : ""}\${disabled ? " is-disabled" : ""}\`}
        style={{ height: CLOSED_HEIGHT }}
      >
        <svg ref={svgRef} className="edd-shape" aria-hidden="true">
          <path ref={pathRef} />
        </svg>

        <div className="edd-content">
          <button
            ref={buttonRef}
            type="button"
            className="edd-trigger"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            onClick={toggle}
            onKeyDown={handleButtonKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <span className={\`edd-icon\${selected ? "" : " is-placeholder"}\`}>
              <TriggerIcon />
            </span>
            <span className={\`edd-value\${selected ? "" : " is-placeholder"}\`}>{triggerLabel}</span>
            <svg
              ref={chevronRef}
              className="edd-chevron"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              style={{ transformOrigin: "50% 50%" }}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {mounted && (
            <div ref={optionsWrapRef} className="edd-options-wrap">
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                tabIndex={-1}
                aria-activedescendant={optionId(activeIndex)}
                className="edd-list"
                onKeyDown={handleListKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              >
                {options.map((option, index) => {
                  const OptionIcon = option.icon
                  return (
                    <li
                      key={option.value}
                      id={optionId(index)}
                      role="option"
                      aria-selected={selectedIndex === index}
                      className={\`edd-option\${activeIndex === index ? " is-active" : ""}\${
                        selectedIndex === index ? " is-selected" : ""
                      }\`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectOption(index)}
                    >
                      {OptionIcon && (
                        <span className="edd-icon">
                          <OptionIcon />
                        </span>
                      )}
                      <span>{option.label}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Off-screen twin of the option list, always laid out at full
            height, used only to measure the true expanded height. */}
        <div ref={optionsMeasureRef} className="edd-options-measure" aria-hidden="true">
          <div className="edd-options-wrap" style={{ opacity: 1 }}>
            <ul className="edd-list">
              {options.map((option) => {
                const OptionIcon = option.icon
                return (
                  <li key={option.value} className="edd-option">
                    {OptionIcon && (
                      <span className="edd-icon">
                        <OptionIcon />
                      </span>
                    )}
                    <span>{option.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  demo shell                                                          */
/* ------------------------------------------------------------------ */

export default function ElasticDropdownShowcase() {
  const [isDark, setIsDark] = React.useState(false)

  return (
    <div
      className={isDark ? "dark" : undefined}
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        minHeight: 420,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: 24,
        borderRadius: 24,
        background: isDark ? "#0a0a12" : "#f8f7fc",
        transition: "background 400ms ease",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: "9999px",
          opacity: 0.3,
          filter: "blur(60px)",
          background: isDark
            ? "radial-gradient(circle, #4c1d95, transparent 70%)"
            : "radial-gradient(circle, #c4b5fd, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -80,
          left: -60,
          width: 260,
          height: 260,
          borderRadius: "9999px",
          opacity: 0.3,
          filter: "blur(60px)",
          background: isDark
            ? "radial-gradient(circle, #1e3a8a, transparent 70%)"
            : "radial-gradient(circle, #bfdbfe, transparent 70%)",
        }}
      />

      <button
        type="button"
        onClick={() => setIsDark((d) => !d)}
        aria-label="Toggle color theme"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 20,
          display: "flex",
          height: 36,
          width: 36,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          color: isDark ? "#fff" : "#334155",
          background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          {isDark ? (
            <path
              d="M8 2v1.4M8 12.6V14M14 8h-1.4M3.4 8H2M12 4l-1 1M5 11l-1 1M12 12l-1-1M5 5 4 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          )}
          {isDark && <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.4" />}
        </svg>
      </button>

      <div style={{ position: "relative", zIndex: 10 }}>
        <ElasticDropdown placeholder="Project" />
      </div>
    </div>
  )
}
`,
  },
];

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return components.find((c) => c.slug === slug);
}
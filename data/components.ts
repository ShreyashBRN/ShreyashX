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
    { property: "damping", type: "number", default: "28", description: "Spring damping — higher reduces overshoot." },
    { property: "enableShortcuts", type: "boolean", default: "true", description: "Whether pressing an item's shortcut key activates it globally." },
    { property: "className", type: "string", default: "-", description: "Additional classes applied to the outer wrapper." },
  ],
  previewCode: `import { JellyToolbar } from "@/components/jelly-toolbar";

export default function JellyToolbarPreview() {
  return <JellyToolbar />;
}
`,
  sourceCode: `<PASTE THE FULL components/jelly-toolbar.tsx CONTENT HERE>`,
},
];

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return components.find((c) => c.slug === slug);
}
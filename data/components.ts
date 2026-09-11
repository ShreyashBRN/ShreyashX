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
      "A vertical pipe and stacked cards that fill with liquid in sync with page scroll position.",
    fullDescription:
      "A scroll-driven progress indicator: a vertical pipe fills as the page scrolls, and each connected card fills in sequence, glass-morphism style, with animated bubbles and a shimmer sweep.",
    icon: "Droplets",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/liquid-scroll-progress.json",
    importStatement: `import { LiquidScrollProgress } from "@/components/liquid-scroll-progress"`,
    usageJsx: "<LiquidScrollProgress />",
    props: [
      { property: "sections", type: "LiquidScrollProgressSection[]", default: "DEFAULT_SECTIONS", description: "Array of { number, title, description, icon } — one per card, filled in order." },
      { property: "liquidColor", type: "string", default: `"#159cff"`, description: "CSS color used for the liquid fill (pipe + cards)." },
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
  number: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

type LiquidScrollProgressProps = {
  sections?: LiquidScrollProgressSection[];
  liquidColor?: string;
  className?: string;
};

const DEFAULT_SECTIONS: LiquidScrollProgressSection[] = [
  { number: "01", title: "Build Better Interfaces", description: "Beautiful, accessible, and customizable components to speed up your development.", icon: "✦" },
  { number: "02", title: "Designed for Developers", description: "Copy, customize, and ship. Fully open source and built with modern tools.", icon: "</>" },
  { number: "03", title: "Works With Your Stack", description: "Built with modern tools and designed to fit naturally into your existing projects.", icon: "◈" },
  { number: "04", title: "Open Source", description: "Free to use, modify, and contribute. Let's build a better web together.", icon: "♡" },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const PIPE_LEFT = 8;
const PIPE_W = 12;
const GAP = 56;
const TUCK_INTO_CARD = 10;

export function LiquidScrollProgress({
  sections = DEFAULT_SECTIONS,
  liquidColor = "#159cff",
  className = "",
}: LiquidScrollProgressProps) {
  const pipeLiquidRef = React.useRef<HTMLDivElement | null>(null);
  const cardLiquidRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const contentRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  cardLiquidRefs.current = [];
  contentRefs.current = [];

  React.useEffect(() => {
    if (sections.length === 0) return;

    let frame = 0;
    const total = sections.length;

    const update = () => {
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const overall = scrollable > 0 ? clamp(window.scrollY / scrollable) : 0;

        if (pipeLiquidRef.current) {
          pipeLiquidRef.current.style.transform = \`scaleY(\${overall})\`;
        }

        for (let i = 0; i < total; i++) {
          const start = i / total;
          const end = (i + 1) / total;
          const raw = clamp((overall - start) / (end - start));
          const cardFill = clamp((raw - 0.1) / 0.9);
          const isFilled = cardFill >= 0.45;

          const cardEl = cardLiquidRefs.current[i];
          if (cardEl) cardEl.style.transform = \`scaleY(\${cardFill})\`;

          const contentEl = contentRefs.current[i];
          if (contentEl) contentEl.classList.toggle("is-filled", isFilled);
        }
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections.length]);

  if (sections.length === 0) return null;

  return (
    <section
      aria-label="Scroll progress"
      className={\`relative mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 \${className}\`}
    >
      <style>{\`
        .lsp-glass {
          border: 1px solid rgba(148,163,184,0.35);
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          box-shadow:
            inset 1px 0 2px rgba(255,255,255,0.9),
            inset -1px 0 2px rgba(15,23,42,0.08),
            0 1px 4px rgba(15,23,42,0.08);
        }
        .lsp-pipe-connector {
          background: linear-gradient(180deg, #334155 0%, #1e293b 55%, #0f172a 100%);
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.15),
            inset 0 -1px 2px rgba(0,0,0,0.45);
          border: 1px solid rgba(15,23,42,0.6);
        }
        .lsp-liquid {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.65) 0%,
            color-mix(in srgb, var(--lsp-color) 50%, white 50%) 22%,
            color-mix(in srgb, var(--lsp-color) 68%, white 32%) 100%
          );
          box-shadow:
            0 0 8px color-mix(in srgb, var(--lsp-color) 35%, transparent),
            inset 1px 0 2px rgba(255,255,255,0.6);
        }
        .lsp-content { color: #0f172a; transition: color 300ms ease; }
        .lsp-content.is-filled { color: #fff; }
        .lsp-num { color: #64748b; transition: color 300ms ease; }
        .lsp-content.is-filled .lsp-num { color: rgba(255,255,255,0.75); }
        .lsp-desc { color: #64748b; transition: color 300ms ease; }
        .lsp-content.is-filled .lsp-desc { color: rgba(255,255,255,0.85); }
        .lsp-icon {
          border-color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.4);
          color: #2563eb;
          transition: border-color 300ms ease, background-color 300ms ease, color 300ms ease;
        }
        .lsp-content.is-filled .lsp-icon {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        @keyframes liquid-scroll-bubble {
          0%   { transform: translate3d(0, 6px, 0) scale(0.7); opacity: 0; }
          15%  { opacity: 0.7; }
          70%  { opacity: 0.45; }
          100% { transform: translate3d(var(--bubble-drift, 0px), -90px, 0) scale(1); opacity: 0; }
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
          className="absolute bottom-3 top-3 z-20"
          style={{ left: PIPE_LEFT, width: PIPE_W }}
        >
          <div className="lsp-glass absolute inset-0 rounded-full" />

          <div className="absolute inset-[3px] overflow-hidden rounded-full">
            <div
              ref={pipeLiquidRef}
              className="lsp-liquid absolute inset-0 origin-top will-change-transform"
              style={{ transform: "scaleY(0)" }}
            >
              <LiquidBubbles compact />
              <div className="liquid-scroll-motion absolute -left-full top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-[2px] motion-safe:animate-[liquid-scroll-shimmer_2.8s_ease-in-out_infinite]" />
            </div>
          </div>

          <div className="absolute -left-[9px] -top-[8px] z-30 h-[16px] w-[30px] rounded-[6px] border border-slate-700/90 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-[0_3px_8px_rgba(0,0,0,0.25),inset_0_1px_rgba(255,255,255,0.15)]">
            <div className="absolute bottom-[3px] left-[5px] right-[5px] h-[2px] rounded-full bg-black/70" />
          </div>

          <div className="absolute -bottom-[5px] -left-[6px] z-30 h-[11px] w-[24px] rounded-b-[6px] border border-slate-700/90 bg-gradient-to-b from-slate-700 to-slate-950 shadow-[0_3px_6px_rgba(0,0,0,0.25),inset_0_1px_rgba(255,255,255,0.12)]" />
        </div>

        <div className="flex flex-col gap-10 sm:gap-12">
          {sections.map((section, index) => (
            <article
              key={\`\${section.number}-\${section.title}\`}
              className="relative min-h-[132px] w-full sm:min-h-[144px]"
            >
              <div
                aria-hidden="true"
                className="lsp-pipe-connector absolute top-1/2 z-[5] h-[14px] -translate-y-1/2 rounded-full"
                style={{
                  left: -(GAP - PIPE_LEFT),
                  width: GAP - PIPE_LEFT + TUCK_INTO_CARD,
                }}
              />

              <div className="relative z-20 min-h-[132px] overflow-hidden rounded-2xl border border-slate-300/40 bg-white/[0.7] shadow-[0_10px_28px_rgba(20,40,60,0.08),inset_0_1px_rgba(255,255,255,0.9)] backdrop-blur-xl sm:min-h-[144px]">
                <div
                  ref={(node) => {
                    cardLiquidRefs.current[index] = node;
                  }}
                  aria-hidden="true"
                  className="lsp-liquid absolute inset-x-0 bottom-0 top-0 origin-bottom overflow-hidden will-change-transform"
                  style={{ transform: "scaleY(0)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-200/40 via-transparent to-sky-400/20" />
                  <div className="liquid-scroll-motion absolute -left-[5%] -top-[5px] h-3 w-[110%] rounded-[50%] bg-white/35 blur-[2px] motion-safe:animate-[liquid-scroll-wave_2.8s_ease-in-out_infinite]" />
                  <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/15 to-transparent" />
                  <LiquidBubbles />
                  <div className="liquid-scroll-motion absolute -left-full top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md motion-safe:animate-[liquid-scroll-shimmer_3.5s_ease-in-out_infinite]" />
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl border border-white/60 shadow-[inset_0_1px_rgba(255,255,255,0.85),inset_0_-1px_rgba(15,23,42,0.04)]"
                />

                <div
                  ref={(node) => {
                    contentRefs.current[index] = node;
                  }}
                  className="lsp-content relative z-10 grid min-h-[132px] grid-cols-[32px_minmax(0,1fr)_44px] items-center gap-3 px-4 py-5 sm:min-h-[144px] sm:grid-cols-[36px_minmax(0,1fr)_48px] sm:px-5"
                >
                  <div className="lsp-num self-start pt-1 text-[11px] font-semibold tracking-wide sm:text-xs">
                    {section.number}
                  </div>

                  <div className="min-w-0">
                    <h2 className="mb-1.5 text-base font-semibold tracking-[-0.02em] sm:text-lg">
                      {section.title}
                    </h2>
                    <p className="lsp-desc max-w-lg text-[13px] leading-relaxed sm:text-sm">
                      {section.description}
                    </p>
                  </div>

                  {section.icon && (
                    <div className="lsp-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm sm:h-10 sm:w-10">
                      {section.icon}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiquidBubbles({ compact = false }: { compact?: boolean }) {
  const bubbles = compact
    ? [
        { left: "30%", size: 2, duration: "2.4s", delay: "0s", drift: "-1px" },
        { left: "55%", size: 2, duration: "3s", delay: "0.6s", drift: "1px" },
        { left: "75%", size: 2, duration: "2.7s", delay: "1.2s", drift: "-1px" },
      ]
    : [
        { left: "14%", size: 3, duration: "2.6s", delay: "0s", drift: "-2px" },
        { left: "29%", size: 4, duration: "3.2s", delay: "0.7s", drift: "2px" },
        { left: "48%", size: 3, duration: "2.9s", delay: "1.3s", drift: "-1px" },
        { left: "67%", size: 4, duration: "3.4s", delay: "0.35s", drift: "3px" },
        { left: "82%", size: 3, duration: "2.8s", delay: "1.8s", drift: "-2px" },
      ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((bubble, index) => (
        <span
          key={index}
          className="liquid-scroll-motion absolute bottom-0 rounded-full bg-white/60 shadow-[0_0_4px_rgba(255,255,255,0.65)]"
          style={
            {
              left: bubble.left,
              width: \`\${bubble.size}px\`,
              height: \`\${bubble.size}px\`,
              "--bubble-drift": bubble.drift,
              animation: \`liquid-scroll-bubble \${bubble.duration} ease-in \${bubble.delay} infinite\`,
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
];

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return components.find((c) => c.slug === slug);
}
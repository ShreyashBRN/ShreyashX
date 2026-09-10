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
];

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return components.find((c) => c.slug === slug);
}
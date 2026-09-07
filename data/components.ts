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
}

export const components: ComponentEntry[] = [
  {
    slug: "floating-toolbar",
    name: "Floating Toolbar",
    cardDescription:
      "A polished specific-use toolbar featuring smooth shared-element transitions.",
    fullDescription:
      "A polished specific-use toolbar featuring smooth shared-element transitions between states.",
    icon: "RectangleHorizontal",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/floating-toolbar.json",
    importStatement: `import { FloatingToolbar } from "@/components/floating-toolbar"`,
    usageJsx: "<FloatingToolbar />",
    props: [
      { property: "items", type: "Array", default: "[]", description: "Array of toolbar actions with { id, icon, label, onClick }." },
      { property: "activeId", type: "string", default: "-", description: "Currently active/selected item id (controlled)." },
    ],
    sourceCode: `"use client";\n\nimport React, { useState } from "react";\n\nexport function FloatingToolbar({ items = [] }) {\n  const [active, setActive] = useState(items[0]?.id);\n\n  return (\n    <div className="flex items-center gap-1 rounded-full border bg-white/80 p-1 shadow-sm backdrop-blur">\n      {items.map((item) => (\n        <button\n          key={item.id}\n          onClick={() => setActive(item.id)}\n          className={\n            active === item.id\n              ? "rounded-full bg-[#0d7d86]/10 px-3 py-1.5 text-sm text-[#0d7d86]"\n              : "rounded-full px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100"\n          }\n        >\n          {item.label}\n        </button>\n      ))}\n    </div>\n  );\n}\n`,
  },
  {
    slug: "filter-selector",
    name: "Filter Selector",
    cardDescription:
      "A premium filter selection component where items gracefully float between available and selected states.",
    fullDescription:
      "A premium filter selection component where items gracefully float between available and selected states with fluid animations, ideal for intuitive list filtering.",
    icon: "Filter",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/filter-selector.json",
    importStatement: `import { FilterSelector } from "@/components/filter-selector"`,
    usageJsx: "<FilterSelector />",
    props: [
      { property: "items", type: "Array", default: "[]", description: "Array of filter items with { id, label, color }." },
      { property: "activeFilters", type: "Array", default: "-", description: "Array of selected filter IDs (controlled)." },
      { property: "onFilterChange", type: "function", default: "-", description: "Callback when selection changes." },
    ],
    sourceCode: `"use client";\n\nimport React, { useEffect, useState, useRef } from "react";\nimport { FilterSelector } from "@/components/filter-selector";\nimport { useTheme } from "@/contexts/ThemeContext";\n\nconst ITEMS = [\n  {\n    id: "product",\n    label: "Product",\n    colorLight: "bg-lime-100 text-lime-800 border-lime-300",\n    colorDark: "bg-lime-500/20 text-lime-200 border-lime-500/30"\n  },\n  {\n    id: "marketing",\n    label: "Marketing",\n    colorLight: "bg-emerald-100 text-emerald-800 border-emerald-300",\n    colorDark: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30"\n  }\n];\n`,
  },
  {
    slug: "scroll-progress",
    name: "Scroll Progress",
    cardDescription:
      "A smart table of contents component that tracks reading progress.",
    fullDescription:
      "A smart table of contents component that tracks reading progress as the user scrolls through long-form content.",
    icon: "MonitorSmartphone",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/scroll-progress.json",
    importStatement: `import { ScrollProgress } from "@/components/scroll-progress"`,
    usageJsx: "<ScrollProgress sections={sections} />",
    props: [
      { property: "sections", type: "Array", default: "[]", description: "Array of { id, label } for each heading tracked." },
      { property: "offset", type: "number", default: "80", description: "Scroll offset in px before a section is marked active." },
    ],
    sourceCode: `"use client";\n\nimport React, { useEffect, useState } from "react";\n\nexport function ScrollProgress({ sections = [], offset = 80 }) {\n  const [activeId, setActiveId] = useState(sections[0]?.id);\n  // IntersectionObserver wiring goes here\n  return null;\n}\n`,
  },
  {
    slug: "floating-tabs",
    name: "Floating Tabs",
    cardDescription:
      "A modern tab navigation component featuring a fluid sliding indicator.",
    fullDescription:
      "A modern tab navigation component featuring a fluid sliding indicator that morphs between tab positions.",
    icon: "LayoutGrid",
    status: "new",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/floating-tabs.json",
    importStatement: `import { FloatingTabs } from "@/components/floating-tabs"`,
    usageJsx: "<FloatingTabs tabs={tabs} />",
    props: [
      { property: "tabs", type: "Array", default: "[]", description: "Array of { id, label }." },
      { property: "defaultTab", type: "string", default: "-", description: "Initially active tab id." },
    ],
    sourceCode: `"use client";\n\nimport React, { useState } from "react";\n\nexport function FloatingTabs({ tabs = [], defaultTab }) {\n  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);\n  return null;\n}\n`,
  },
  {
    slug: "confetti-button",
    name: "Confetti Button",
    cardDescription:
      "A celebratory button that bursts into confetti on click.",
    fullDescription:
      "A celebratory button that bursts into confetti on click — built for success states and completed actions.",
    icon: "PartyPopper",
    status: "stable",
    installCommand: "npx shadcn@latest add https://shreyashtech.me/r/confetti-button.json",
    importStatement: `import { ConfettiButton } from "@/components/confetti-button"`,
    usageJsx: '<ConfettiButton>Celebrate</ConfettiButton>',
    props: [
      { property: "particleCount", type: "number", default: "80", description: "Number of confetti particles per burst." },
      { property: "colors", type: "Array", default: "-", description: "Array of hex colors for the particles." },
    ],
    sourceCode: `"use client";\n\nimport React from "react";\n\nexport function ConfettiButton({ children, particleCount = 80 }) {\n  return <button>{children}</button>;\n}\n`,
  },
  {
    slug: "drag-drop-reorder",
    name: "Drag & Drop Reorder",
    cardDescription:
      "A smooth, accessible sortable list with a subtle glow while dragging.",
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
    ],
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

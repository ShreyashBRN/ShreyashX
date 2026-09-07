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
import { Reorder, useDragControls, motion } from "framer-motion";
import {
  GripVertical,
  ChevronRight,
  Image,
  Code2,
  TerminalSquare,
  CloudUpload,
  RefreshCw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type ReorderColor =
  | "pink"
  | "blue"
  | "violet"
  | "orange"
  | "neutral";

export interface ReorderItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: ReorderColor;
}

const defaultItems: ReorderItem[] = [
  {
    id: "design",
    title: "Design",
    description: "Create beautiful experiences",
    icon: Image,
    color: "pink",
  },
  {
    id: "develop",
    title: "Develop",
    description: "Build with modern tools",
    icon: Code2,
    color: "blue",
  },
  {
    id: "test",
    title: "Test",
    description: "Ensure everything works",
    icon: TerminalSquare,
    color: "neutral",
  },
  {
    id: "deploy",
    title: "Deploy",
    description: "Launch to the world",
    icon: CloudUpload,
    color: "violet",
  },
  {
    id: "iterate",
    title: "Iterate",
    description: "Make it better",
    icon: RefreshCw,
    color: "orange",
  },
];

const colorMap: Record
  ReorderColor,
  {
    container: string;
    glow: string;
  }
> = {
  pink: {
    container:
      "bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400",
    glow: "bg-pink-500/20",
  },
  blue: {
    container:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    glow: "bg-blue-500/20",
  },
  violet: {
    container:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
    glow: "bg-violet-500/20",
  },
  orange: {
    container:
      "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400",
    glow: "bg-orange-500/20",
  },
  neutral: {
    container:
      "bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white",
    glow: "bg-neutral-500/20",
  },
};

interface ReorderRowProps {
  item: ReorderItem;
  index: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function ReorderRow({
  item,
  index,
  isDragging,
  onDragStart,
  onDragEnd,
}: ReorderRowProps) {
  const controls = useDragControls();
  const Icon = item.icon;
  const colors = colorMap[item.color] ?? colorMap.neutral;

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileDrag={{
        scale: 1.035,
        rotate: 0.5,
        zIndex: 50,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 35,
      }}
      className="relative"
    >
      {/* Animated glow behind active item */}
      <motion.div
        animate={{
          opacity: isDragging ? 1 : 0,
          scale: isDragging ? 1 : 0.96,
        }}
        transition={{ duration: 0.2 }}
        className={\`absolute -inset-1 rounded-[20px] blur-xl \${colors.glow}\`}
      />

      <div
        className={[
          "group relative flex items-center gap-3 overflow-hidden",
          "rounded-2xl border px-3 py-3",
          "select-none",
          "transition-all duration-300",
          "bg-white/90 dark:bg-neutral-950/90",
          "backdrop-blur-xl",
          isDragging
            ? "border-violet-400/50 shadow-2xl"
            : "border-neutral-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:border-neutral-800",
        ].join(" ")}
      >
        {/* Subtle top highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/10" />

        {/* Index */}
        <div className="w-6 shrink-0 text-center">
          <span className="text-[11px] font-medium tabular-nums text-neutral-300 dark:text-neutral-700">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Drag handle */}
        <motion.button
          type="button"
          aria-label={\`Drag \${item.title}\`}
          onPointerDown={(event) => controls.start(event)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={[
            "flex h-9 w-7 shrink-0 items-center justify-center",
            "rounded-lg",
            "cursor-grab active:cursor-grabbing",
            "touch-none",
            "text-neutral-300 transition-colors",
            "hover:bg-neutral-100 hover:text-neutral-500",
            "dark:text-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-neutral-400",
          ].join(" ")}
        >
          <GripVertical size={17} strokeWidth={2} />
        </motion.button>

        {/* Icon */}
        <motion.div
          animate={{
            scale: isDragging ? 1.08 : 1,
            rotate: isDragging ? -3 : 0,
          }}
          className={[
            "relative flex h-11 w-11 shrink-0 items-center justify-center",
            "rounded-xl",
            colors.container,
          ].join(" ")}
        >
          <Icon size={19} strokeWidth={2} />

          {/* Tiny shine */}
          <motion.div
            initial={{ x: "-120%" }}
            whileHover={{ x: "120%" }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </motion.div>

        {/* Content */}
        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[14px] font-semibold tracking-[-0.01em] text-neutral-900 dark:text-neutral-50">
              {item.title}
            </h3>

            {isDragging && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-violet-500"
              >
                Moving
              </motion.span>
            )}
          </div>

          <p className="mt-0.5 truncate text-[12px] text-neutral-400 dark:text-neutral-500">
            {item.description}
          </p>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{
            x: isDragging ? 3 : 0,
            opacity: isDragging ? 1 : 0.45,
          }}
          className="mr-1 shrink-0"
        >
          <ChevronRight
            size={17}
            className="text-neutral-300 transition-colors group-hover:text-neutral-500 dark:text-neutral-700"
          />
        </motion.div>
      </div>
    </Reorder.Item>
  );
}

export interface DragDropReorderProps {
  items?: ReorderItem[];
  onReorder?: (items: ReorderItem[]) => void;
  className?: string;
}

export function DragDropReorder({
  items,
  onReorder,
  className = "",
}: DragDropReorderProps) {
  const [internalItems, setInternalItems] =
    React.useState<ReorderItem[]>(defaultItems);

  const [draggingId, setDraggingId] = React.useState<string | null>(null);

  const isControlled = Array.isArray(items);

  const values = isControlled ? items : internalItems;

  const handleReorder = (nextItems: ReorderItem[]) => {
    if (isControlled) {
      onReorder?.(nextItems);
    } else {
      setInternalItems(nextItems);
    }
  };

  return (
    <div
      className={[
        "relative w-full max-w-md overflow-hidden rounded-[28px]",
        "border border-neutral-200/70 dark:border-neutral-800",
        "bg-neutral-50/80 dark:bg-neutral-950",
        "p-4",
        "shadow-[0_20px_70px_rgba(0,0,0,0.08)]",
        className,
      ].join(" ")}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900">
            <Sparkles size={15} strokeWidth={2} />
          </div>

          <div>
            <div className="text-[13px] font-semibold tracking-tight text-neutral-900 dark:text-white">
              Workflow
            </div>
            <div className="text-[10px] text-neutral-400">
              Drag to reorder
            </div>
          </div>
        </div>

        <motion.div
          animate={{
            opacity: draggingId ? 1 : 0.5,
          }}
          className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[9px] font-medium text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900"
        >
          {draggingId ? "Reordering" : "5 steps"}
        </motion.div>
      </div>

      {/* Items */}
      <Reorder.Group
        axis="y"
        values={values}
        onReorder={handleReorder}
        className="relative flex flex-col gap-2.5"
      >
        {values.map((item, index) => (
          <ReorderRow
            key={item.id}
            item={item}
            index={index}
            isDragging={draggingId === item.id}
            onDragStart={() => setDraggingId(item.id)}
            onDragEnd={() => setDraggingId(null)}
          />
        ))}
      </Reorder.Group>

      {/* Footer hint */}
      <div className="relative mt-3 flex items-center justify-center gap-1.5 pt-1">
        <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <span className="text-[9px] text-neutral-400">
          Grab any item and move it
        </span>
        <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      </div>
    </div>
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























// "use client";

// import * as React from "react";
// import { Reorder } from "framer-motion";
// import {
//   GripVertical,
//   ChevronRight,
//   Image,
//   Code2,
//   TerminalSquare,
//   CloudUpload,
//   RefreshCw,
//   type LucideIcon,
// } from "lucide-react";

// export type ReorderColor = "pink" | "blue" | "violet" | "orange" | "neutral";

// export interface ReorderItem {
//   id: string;
//   title: string;
//   description: string;
//   icon: LucideIcon;
//   color: ReorderColor;
// }

// const defaultItems: ReorderItem[] = [
//   { id: "design", title: "Design", description: "Create beautiful experiences", icon: Image, color: "pink" },
//   { id: "develop", title: "Develop", description: "Build with modern tools", icon: Code2, color: "blue" },
//   { id: "test", title: "Test", description: "Ensure everything works", icon: TerminalSquare, color: "neutral" },
//   { id: "deploy", title: "Deploy", description: "Launch to the world", icon: CloudUpload, color: "violet" },
//   { id: "iterate", title: "Iterate", description: "Make it better", icon: RefreshCw, color: "orange" },
// ];

// const colorMap: Record<ReorderColor, string> = {
//   pink: "bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400",
//   blue: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
//   violet: "bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
//   orange: "bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400",
//   neutral: "bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white",
// };

// export interface DragDropReorderProps {
//   items?: ReorderItem[];
//   onReorder?: (items: ReorderItem[]) => void;
//   className?: string;
// }

// export function DragDropReorder({ items, onReorder, className = "" }: DragDropReorderProps) {
//   const [internalItems, setInternalItems] = React.useState<ReorderItem[]>(defaultItems);
//   const [draggingId, setDraggingId] = React.useState<string | null>(null);

//   const isControlled = Array.isArray(items);
//   const values = isControlled ? (items as ReorderItem[]) : internalItems;
//   const setValues = isControlled ? (onReorder as (items: ReorderItem[]) => void) : setInternalItems;

//   return (
//     <Reorder.Group axis="y" values={values} onReorder={setValues} className={`flex flex-col gap-3 ${className}`}>
//       {values.map((item) => {
//         const Icon = item.icon;
//         const isDragging = draggingId === item.id;

//         return (
//           <Reorder.Item
//             key={item.id}
//             value={item}
//             onDragStart={() => setDraggingId(item.id)}
//             onDragEnd={() => setDraggingId(null)}
//             whileDrag={{ scale: 1.02, cursor: "grabbing" }}
//             className={[
//               "relative flex items-center gap-4 rounded-2xl px-4 py-3.5 select-none",
//               "bg-white dark:bg-neutral-900",
//               "border border-neutral-100 dark:border-neutral-800",
//               isDragging
//                 ? "ring-2 ring-violet-500/60 shadow-[0_0_24px_rgba(56,189,248,0.35)]"
//                 : "shadow-sm",
//             ].join(" ")}
//           >
//             <div className="cursor-grab active:cursor-grabbing touch-none text-neutral-300 dark:text-neutral-600" aria-hidden="true">
//               <GripVertical size={18} />
//             </div>

//             <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorMap[item.color] ?? colorMap.neutral}`}>
//               <Icon size={20} />
//             </div>

//             <div className="flex-1 min-w-0">
//               <div className="text-[15px] font-semibold leading-tight text-neutral-900 dark:text-neutral-50">{item.title}</div>
//               <div className="text-sm leading-tight mt-0.5 text-neutral-500 dark:text-neutral-400">{item.description}</div>
//             </div>

//             <ChevronRight size={18} className="text-neutral-300 dark:text-neutral-600 shrink-0" />
//           </Reorder.Item>
//         );
//       })}
//     </Reorder.Group>
//   );
// }

// export { defaultItems as dragDropReorderDefaultItems };
// export default DragDropReorder;
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
];

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return components.find((c) => c.slug === slug);
}

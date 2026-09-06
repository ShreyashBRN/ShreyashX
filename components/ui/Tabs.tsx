"use client";

// components/ui/Tabs.tsx
//
// One generic tab component covers every tab UI in your screenshots:
// Preview/Code, CLI/Manual, and npm/pnpm/yarn/bun. Deliberately uses
// `flex-wrap` on the tab row so on very narrow phones (< 340px) the pills
// wrap to a second line instead of overflowing — cheap insurance, doesn't
// change layout on any screen you actually tested.

import { useState, ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  /** "pill" = rounded segmented control (CLI/Manual, npm/pnpm/yarn/bun) */
  /** "underline" = Preview/Code style with bottom border indicator */
  variant?: "pill" | "underline";
  rightSlot?: ReactNode; // e.g. the expand icon in the Preview/Code header
}

export function Tabs({ tabs, defaultTabId, variant = "underline", rightSlot }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className="min-w-0 max-w-full">
      <div className="flex min-w-0 max-w-full flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-2">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              className={
                variant === "underline"
                  ? `px-3 py-3 text-sm font-medium ${
                      activeId === tab.id
                        ? "border-b-2 border-[#0d7d86] text-neutral-900"
                        : "border-b-2 border-transparent text-neutral-400 hover:text-neutral-600"
                    }`
                  : `rounded-lg px-3 py-1.5 text-sm font-mono ${
                      activeId === tab.id
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
        {rightSlot && <div className="shrink-0 py-2">{rightSlot}</div>}
      </div>
      <div className="min-w-0 max-w-full p-4 sm:p-6">{active?.content}</div>
    </div>
  );
}

/** Wrapper matching the "CLI / Manual" and "npm / pnpm / yarn / bun" segmented pill look */
export function PillTabGroup({ tabs, defaultTabId }: { tabs: Tab[]; defaultTabId?: string }) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className="min-w-0 max-w-full">
      <div className="mb-4 inline-flex flex-wrap gap-1 rounded-xl bg-neutral-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={
              activeId === tab.id
                ? "rounded-lg bg-white px-4 py-1.5 font-mono text-sm text-neutral-900 shadow-sm"
                : "rounded-lg px-4 py-1.5 font-mono text-sm text-neutral-400 hover:text-neutral-600"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="min-w-0 max-w-full">{active?.content}</div>
    </div>
  );
}

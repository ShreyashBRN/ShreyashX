// components/ComponentCard.tsx
//
// Assumes lucide-react is already a dependency (common in Next.js/Tailwind
// starters) since your screenshots use that icon style. If it's not
// installed: npm install lucide-react

import Link from "next/link";
import * as Icons from "lucide-react";
import { ComponentEntry } from "@/data/components";
import type { LucideIcon } from "lucide-react";

export function ComponentCard({ entry }: { entry: ComponentEntry }) {
  // const Icon = (Icons as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[entry.icon] ?? Icons.Box;
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[entry.icon] ?? Icons.Box;
  return (
    <Link
      href={`/components/${entry.slug}`}
      className="group flex min-w-0 max-w-full items-start gap-4 rounded-2xl border border-neutral-200 p-5 transition-colors hover:border-[#0d7d86]/40 hover:bg-[#0d7d86]/[0.03]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 group-hover:bg-[#0d7d86]/10 group-hover:text-[#0d7d86]">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-neutral-900">{entry.name}</h3>
          {entry.status === "new" && (
            <span aria-label="New" className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{entry.cardDescription}</p>
      </div>
    </Link>
  );
}

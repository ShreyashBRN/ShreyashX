// components/ComponentCard.tsx

import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { ComponentEntry } from "@/data/components";

export function ComponentCard({ entry }: { entry: ComponentEntry }) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[entry.icon] ?? Icons.Box;

  return (
    <Link
      href={`/components/${entry.slug}`}
      className="group relative flex min-w-0 max-w-full items-start gap-4 rounded-2xl border border-neutral-200/90 bg-white/70 p-4 sm:p-5 transition-all duration-200 hover:border-neutral-300 hover:bg-white hover:shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/40 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200/80 bg-neutral-50/80 text-neutral-600 transition-colors group-hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300 dark:group-hover:border-neutral-700">
        <Icon size={20} strokeWidth={1.75} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[15px] sm:text-[16px] font-semibold tracking-[-0.01em] text-neutral-900 dark:text-neutral-100">
            {entry.name}
          </h3>
          {entry.status === "new" && (
            <span aria-label="New" className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          )}
          <ChevronRight
            size={16}
            className="ml-auto shrink-0 text-neutral-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-500 dark:text-neutral-600 dark:group-hover:text-neutral-400"
          />
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          {entry.cardDescription}
        </p>
      </div>
    </Link>
  );
}

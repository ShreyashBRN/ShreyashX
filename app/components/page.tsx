// app/components/page.tsx
//
// Mirrors app/blog/page.tsx's pattern: import the data array, render a
// header block, then map over entries. Uses ComponentsNavbar (not the site
// Navbar) so dark mode + always-visible links only apply to this section.
// Your real <Footer /> is still used as-is — it has no dark: styling since
// I haven't seen its source, so it'll stay light even when this page is
// toggled dark until you share it for an update.

import Container from "@/components/Container";
import ComponentsNavbar from "@/components/ComponentsNavbar";
import Footer from "@/components/Footer";
import { components } from "@/data/components";
import { ComponentCard } from "@/components/ComponentCard";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Components",
  description:
    "A curated collection of modern, reusable React components. Built with performance and accessibility in mind. Copy, paste, and customize.",
};

const CHECKLIST = ["Copy & Paste", "Tailwind CSS", "Accessible"];

export default function ComponentsPage() {
  return (
    <main className="overflow-x-clip bg-[#f6f4ef] pt-14 transition-colors dark:bg-neutral-950">
      <ComponentsNavbar />
      <Container>
        <div className="mx-auto min-w-0 max-w-3xl py-10 sm:py-14 lg:py-20">
          {/* Badges */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              {components.length} Components
            </span>
            <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
              Open Source
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
            Components
          </h1>
          <p className="mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-400 sm:text-lg">
            A curated collection of modern, reusable React components. Built with
            performance and accessibility in mind. Copy, paste, and customize.
          </p>

          {/* Checklist row — wraps on narrow phones instead of overflowing */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {CHECKLIST.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <CheckCircle size={16} className="shrink-0 text-neutral-400 dark:text-neutral-500" />
                {item}
              </div>
            ))}
          </div>

          {/* Grid: 1 col mobile, 2 col tablet+ (content column is capped at max-w-3xl) */}
          <div className="mt-10 grid min-w-0 max-w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {components.map((entry) => (
              <ComponentCard key={entry.slug} entry={entry} />
            ))}
          </div>

          {/* Credit footer block */}
          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800" />
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">siddz-ui</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">Built by Siddharth Meena</p>
              </div>
            </div>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">more components soon :)</p>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}

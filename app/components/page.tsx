// app/components/page.tsx
//
// Mirrors app/blog/page.tsx's pattern: import the data array, render a
// header block, then map over entries. Swap Container/Navbar/Footer for
// your real components — I don't have their source, so these imports
// assume the same props signature you use elsewhere in the app (no props,
// just wraps children). Adjust if yours differ.

import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
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
    <main className="overflow-x-clip pt-14">
      <Navbar />
      <Container>
      <div className="mx-auto min-w-0 max-w-3xl py-10 sm:py-14 lg:py-20">
        {/* Badges */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
            {components.length} Components
          </span>
          <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600">
            Open Source
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Components
        </h1>
        <p className="mt-4 max-w-2xl text-base text-neutral-500 sm:text-lg">
          A curated collection of modern, reusable React components. Built with
          performance and accessibility in mind. Copy, paste, and customize.
        </p>

        {/* Checklist row — wraps on narrow phones instead of overflowing */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {CHECKLIST.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-neutral-500">
              <CheckCircle size={16} className="shrink-0 text-neutral-400" />
              {item}
            </div>
          ))}
        </div>

        {/* Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="mt-10 grid min-w-0 max-w-full grid-cols-1 gap-4 sm:grid-cols-2 ">
          {components.map((entry) => (
            <ComponentCard key={entry.slug} entry={entry} />
          ))}
        </div>

        {/* Credit footer block */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-100" />
            <div>
              <p className="text-sm font-medium text-neutral-900">siddz-ui</p>
              <p className="text-xs text-neutral-400">Built by Siddharth Meena</p>
            </div>
          </div>
          <p className="text-sm text-neutral-400">more components soon :)</p>
        </div>
      </div>
      </Container>
      <Footer />
    </main>
  );
}

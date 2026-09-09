// app/components/page.tsx

import { CheckCircle2 } from "lucide-react";
import Container from "@/components/Container";
import ComponentsNavbar from "@/components/ComponentsNavbar";
import Footer from "@/components/Footer";
import { ComponentCard } from "@/components/ComponentCard";
import { components } from "@/data/components";

export const metadata = {
  title: "Components | Shreyash Bagade",
  description: "A curated collection of modern, reusable React components. Built with performance and accessibility in mind. Copy, paste, and customize.",
};

export default function ComponentsPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f6f4ef] pt-14 transition-colors dark:bg-neutral-950">
      <ComponentsNavbar />

      <Container>
        <div className="mx-auto min-w-0 max-w-3xl py-10 sm:py-14 lg:py-16">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center rounded-full border border-[#a7f3d0] bg-[#ecfdf5] px-3 py-0.5 font-mono text-[11px] font-normal uppercase tracking-wider text-[#059669] dark:border-[#059669]/40 dark:bg-[#064e3b]/30 dark:text-[#34d399]">
              13 COMPONENTS
            </span>
            <span className="inline-flex items-center rounded-full border border-neutral-300/80 bg-neutral-100/80 px-3 py-0.5 font-mono text-[11px] font-normal uppercase tracking-wider text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300">
              OPEN SOURCE
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Components
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-[16px]">
            A curated collection of modern, reusable React components. Built with performance and accessibility in mind. Copy, paste, and customize.
          </p>

          {/* Feature Checkmarks Row — strictly single line on all screen sizes */}
          <div className="mt-6 flex flex-nowrap items-center gap-3.5 text-[12px] whitespace-nowrap text-neutral-600 dark:text-neutral-400 sm:gap-6 sm:text-sm">
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <CheckCircle2 size={15} className="text-neutral-400 dark:text-neutral-500" strokeWidth={2} />
              <span>Copy & Paste</span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <CheckCircle2 size={15} className="text-neutral-400 dark:text-neutral-500" strokeWidth={2} />
              <span>Tailwind CSS</span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <CheckCircle2 size={15} className="text-neutral-400 dark:text-neutral-500" strokeWidth={2} />
              <span>Accessible</span>
            </div>
          </div>

          {/* Components Grid */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {components.map((entry) => (
              <ComponentCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </div>
      </Container>

      <Footer />
    </main>
  );
}
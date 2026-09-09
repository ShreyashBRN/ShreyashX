// app/components/page.tsx

import Container from "@/components/Container";
import ComponentsNavbar from "@/components/ComponentsNavbar";
import Footer from "@/components/Footer";
import { ComponentCard } from "@/components/ComponentCard";
import { components } from "@/data/components";

export const metadata = {
  title: "Components | Shreyash Bagade",
  description: "Hand-crafted, animated UI components built with React, Tailwind CSS, and Framer Motion.",
};

export default function ComponentsPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f6f4ef] pt-14 transition-colors dark:bg-neutral-950">
      <ComponentsNavbar />

      <Container>
        <div className="mx-auto min-w-0 max-w-3xl py-10 sm:py-14 lg:py-20">
          <span className="inline-flex flex-col text-[13px] font-semibold text-[#0d7d86] tracking-[0.08em] uppercase dark:text-[#2dd4bf]">
            <span>UI Components</span>
            <span className="relative h-[2px] w-full overflow-hidden">
              <span className="line absolute top-0 h-full bg-[#0d7d86] dark:bg-[#2dd4bf]" />
            </span>
          </span>

          <h1 className="mt-4 font-bricolage text-[32px] font-extrabold tracking-[-0.03em] text-[#111111] dark:text-neutral-50 sm:text-[36px] lg:text-[58px]">
            Components<span className="text-[#0d7d86] dark:text-[#2dd4bf]">.</span>
          </h1>

          <p className="mt-3 max-w-[560px] text-[15px] leading-[1.7] text-[#4a4a4a] dark:text-neutral-400 sm:text-[16px]">
            Hand-crafted, animated UI components built with React, Tailwind CSS, and Framer Motion. Copy and paste into your apps.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-6">
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
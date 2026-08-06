
"use client";
import { useRef, useState } from "react";
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  motion,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import { projects, type Project } from "@/data/projects";

// Adjust this to your actual fixed Navbar's rendered height in px.
const NAVBAR_HEIGHT = 32;
const PEEK_OFFSET = 6; // px each stacked card peeks above the one below it

function StackCard({
  project,
  index,
  total,
  scrollYProgress,
  variant,
}: {
  project: Project;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  variant: "desktop" | "mobile";
}) {
  const start = index / total;
  const end = (index + 1) / total;

  // Slides up from below into its resting stacked position, then holds there.
  const y = useTransform(scrollYProgress, [start, end], [920, index * PEEK_OFFSET]);
  const opacity = useTransform(scrollYProgress, [start, start + 0.05], [0, 1]);

  return (
    <motion.div
  style={{ y, opacity: 1, zIndex: index + 1 }}
  className="absolute inset-x-0 top-0"
>
      {variant === "desktop" ? (
        <div className="group relative w-full h-[300px] rounded-[24px] overflow-hidden border border-black/[.06] shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="500px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            {project.links.map((link) => (
              <Link
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold text-[#111111] bg-white rounded-full px-4 py-2 transition-transform duration-250 hover:-translate-y-[2px]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <article className="bg-white rounded-[24px] border border-black/[.06] shadow-[0_18px_50px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="relative w-full h-[220px]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <span className="text-[12px] px-2 py-1 font-semibold text-[#0d7d86] bg-[#DBE2DC] uppercase tracking-wide">
              {project.category}
            </span>
            <h3 className="mt-1 text-[18px] font-bold text-[#111111]">
              {project.title}
            </h3>
            <p className="mt-1 text-[13px] text-[#4a4a4a] leading-[1.5] line-clamp-2">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium text-[#4a4a4a] bg-[#f6f4ef] border border-[#e0e0e0] rounded-full px-2.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-semibold text-white bg-[#111111] rounded-full px-3 py-1.5"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </article>
      )}
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = projects.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(total - 1, Math.floor(v * total));
    setActiveIndex(idx);
  });

  const activeProject = projects[activeIndex];

  return (
    // Tall scroll runway: gives the pinned view enough scroll distance
    // to step through every card before releasing back to normal scroll.
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-[#F2F1ED]"
      style={{ height: `${total * 100}vh` }}
    >
      <div
        className="sticky overflow-hidden flex flex-col"
        style={{
          top: NAVBAR_HEIGHT,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <Container className="pt-8 lg:pt-14 shrink-0">
          <h2 className="font-bricolage text-[32px] sm:text-[36px] lg:text-[58px] font-extrabold text-[#111111] tracking-[-0.03em]">
            Projects.
          </h2>
          <p className="hidden lg:block mt-1 max-w-[560px] text-[15px] sm:text-[16px] text-[#4a4a4a] leading-[1.7]">
          Selected work across websites, landing pages, and mobile<br /> apps. Scroll the gallery to explore each build.
          </p>
        </Container>

        {/* Desktop: split layout */}
        <Container className="hidden lg:grid lg:grid-cols-2 lg:gap-16 flex-1 min-h-0 mt-8">
          <div className="self-center h-full">
            <span className="text-[13px] font-semibold text-[#0d7d86] uppercase tracking-wide bg-[#DBE2DC] px-2 py-1 rounded-[6px]">
              {activeProject.category}
            </span>
            <h3 className="mt-2 font-bricolage text-[36px] font-bold text-[#111111]">
              {activeProject.title}
            </h3>
            <p className="mt-2  max-w-[440px] text-[17px] text-[#4a4a4a] leading-[1.7]">
              {activeProject.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[13px] font-medium text-[#4a4a4a] bg-[#E7E6E1] border border-[#e0e0e0] rounded-[10px] px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-7 flex gap-3">
              {activeProject.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-semibold text-white bg-[#111111] rounded-[10px] px-4 py-3 transition-colors duration-250 hover:bg-[#222222]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-10 flex gap-2">
              {projects.map((_, i) => (
                <span
                  key={i}
                  className={`h-[3px] w-6 rounded-full transition-colors duration-300 ${
                    i === activeIndex ? "bg-[#0d7d86]" : "bg-[#d6d6d6]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative h-full self-center -mt-64">
            {projects.map((project, i) => (
              <StackCard
                key={project.id}
                project={project}
                index={i}
                total={total}
                scrollYProgress={scrollYProgress}
                variant="desktop"
              />
            ))}
          </div>
        </Container>

        {/* Mobile: single stacked column with full card content */}
        <Container className="lg:hidden relative flex-1 min-h-0 mt-6">
          <div className="relative h-full">
            {projects.map((project, i) => (
              <StackCard
                key={project.id}
                project={project}
                index={i}
                total={total}
                scrollYProgress={scrollYProgress}
                variant="mobile"
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
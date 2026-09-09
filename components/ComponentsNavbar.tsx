"use client";

import Link from "next/link";
import Container from "./Container";
import { ThemeToggle } from "./ThemeToggle";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-block text-[15px] text-neutral-600 transition-colors duration-300 hover:text-[#0d7d86] dark:text-neutral-300 dark:hover:text-[#2dd4bf]"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#0d7d86] transition-transform duration-300 ease-out group-hover:scale-x-100 dark:bg-[#2dd4bf]" />
    </Link>
  );
}

export default function ComponentsNavbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-[#f6f4ef]/80 backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/80">
      <Container>
        {/* max-w-3xl aligns the navbar links and toggle with the exact same
            centered content column used across /components and /components/[slug] */}
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between">
          <nav className="flex items-center gap-6 sm:gap-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/components">Components</NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
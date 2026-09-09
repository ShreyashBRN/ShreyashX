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
      <Container className="h-16">
        {/* Explicit w-full + justify-between here, independent of how
            Container merges its own className — this is what pins the
            links to the left edge and the toggle to the right edge. */}
        <div className="flex h-16 w-full items-center justify-between">
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
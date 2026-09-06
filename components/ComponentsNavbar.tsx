"use client";

// components/ComponentsNavbar.tsx
//
// Deliberately a separate component from your main Navbar, not a responsive
// variant of it — your main Navbar's mobile behavior (fullscreen hamburger
// menu) is untouched everywhere else on the site. This one only gets
// rendered by app/components/page.tsx and app/components/[slug]/page.tsx.
//
// Key difference from Navbar: no `hidden md:flex` on the link row, so the
// same inline links show at every viewport width — matching the reference
// screenshot you sent, which never shows a hamburger at all.

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
    <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/80">
      <Container className="flex h-16 items-center justify-between">
        {/* No `hidden md:flex` here on purpose — this row shows at every width */}
        <nav className="flex items-center gap-6 sm:gap-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/components">Components</NavLink>
        </nav>
        <ThemeToggle />
      </Container>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative inline-block text-[#141816] transition-colors duration-300 hover:text-[#0d7377]"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#0d7377] transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
    </a>
  );
}

function TalkButton() {
  return (
    <a
      href="#contact"
      className="group relative hidden md:inline-block overflow-hidden rounded-full bg-black px-4 py-[11px] text-sm font-medium text-white"
    >
      {/* Reserves layout space; actual text is rendered by the two absolutely
          positioned layers below so the swap has no visible seam. */}
      <span className="invisible">Let&apos;s Talk</span>

      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-full">
        Let&apos;s Talk
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex translate-y-full items-center justify-center transition-transform duration-300 ease-out group-hover:translate-y-0"
      >
        Let&apos;s Talk
      </span>
    </a>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-[#f6f4ef]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-[1.05rem] font-inter font-bold tracking-[-0.04em] text-[#141816] transition-colors duration-300 hover:text-[#0d7377]"
          >
            Shreyash Bagade
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 text-[15px] font-medium md:flex">
            <NavLink href="#projects">Projects</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>

          <TalkButton />

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Open menu"
          >
            <span className="block h-0.5 w-6 bg-black"></span>
            <span className="block h-0.5 w-6 bg-black"></span>
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#f6f4ef]">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
            <span className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#141816]">
              Shreyash Bagade
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="relative flex h-8 w-8 items-center justify-center"
              aria-label="Close menu"
            >
              <span className="absolute h-0.5 w-6 rotate-45 bg-black"></span>
              <span className="absolute h-0.5 w-6 -rotate-45 bg-black"></span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-16 text-3xl font-semibold text-[#141816]">
            <a href="#projects" onClick={() => setIsOpen(false)}>
              Projects
            </a>
            <a href="/blog" onClick={() => setIsOpen(false)}>
              Blog
            </a>
            <a href="#contact" onClick={() => setIsOpen(false)}>
              Contact
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
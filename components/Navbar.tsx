"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PopupButton } from "react-calendly";
import Container from "./Container";
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
  const [rootEl, setRootEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRootEl(document.body);
  }, []);

  if (!rootEl) return null;

  return (
    <PopupButton
      url="https://calendly.com/shreyashbagade-work/30min"
      rootElement={rootEl}
      text="Let's Talk"
      className="group relative hidden md:inline-block cursor-pointer overflow-hidden rounded-full bg-black px-4 py-[11px] text-sm font-medium text-white"
    />
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-black/5 bg-[#f6f4ef]/80 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between">
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
        </Container>
      </header>

      {/* Mobile fullscreen menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#f6f4ef]">
          <Container className="flex h-16 items-center justify-between">
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
          </Container>

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
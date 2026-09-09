// components/ComponentsFooter.tsx

import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Container from "./Container";

export default function ComponentsFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-200/80 bg-[#f6f4ef] py-9 transition-colors dark:border-neutral-800 dark:bg-neutral-950 sm:py-10">
      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-5 sm:flex-row sm:gap-6">
          {/* Left: Copyright | Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 text-[14px] text-neutral-500 sm:justify-start sm:gap-4 sm:text-[15px] dark:text-neutral-400">
            <span className="font-medium">&copy; {year} Shreyash.</span>

            <span className="text-neutral-300 select-none dark:text-neutral-700">|</span>

            <nav className="flex items-center gap-4 sm:gap-5">
              <Link
                href="/"
                className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                Portfolio
              </Link>
              <Link
                href="/#contact"
                className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                Contact
              </Link>
              <Link
                href="/components"
                className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                Components
              </Link>
            </nav>
          </div>

          {/* Right: Social Media Logos (Mail, LinkedIn, GitHub) */}
          <div className="flex items-center gap-5 text-neutral-600 dark:text-neutral-400">
            <a
              href="mailto:shreyashbagade.work@gmail.com"
              aria-label="Email"
              className="transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <Mail size={20} strokeWidth={1.8} />
            </a>
            <a
              href="https://www.linkedin.com/in/shreyash-b-949033432/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <FaLinkedin size={19} />
            </a>
            <a
              href="https://github.com/ShreyashBRN"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              <FaGithub size={19} />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

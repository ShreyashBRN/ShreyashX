"use client";

// components/ThemeToggle.tsx
//
// Renders nothing until `mounted` is true — same guard your TalkButton uses
// for rootElement — so we never render a moon icon on the server and a sun
// icon on the client (or vice versa) and trip a hydration warning.

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    // Reserve the same footprint so surrounding layout doesn't shift once
    // this becomes interactive.
    return <div className="h-5 w-5" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="flex h-5 w-5 items-center justify-center text-neutral-600 transition-colors hover:text-[#0d7d86] dark:text-neutral-300 dark:hover:text-[#2dd4bf]"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

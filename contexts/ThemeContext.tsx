"use client";

// contexts/ThemeContext.tsx
//
// Scoped deliberately: only app/components/layout.tsx wraps its children in
// this provider, so light/dark only exists as a concept on the /components
// route tree. The rest of your site never renders a toggle button and never
// gets a `dark` class added, so nothing there can be affected.
//
// The class still lands on <html> (not some inner wrapper) because Tailwind's
// `dark:` variant only works via an ancestor selector — but since it's only
// ever toggled from within /components, in practice it only "does something"
// on pages that actually have dark: classes, which right now is just this
// section.

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "components-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Runs once on mount, client-only — reads saved preference, falls back to
  // system preference, then applies the class. Doing this in an effect
  // (not during render) avoids a server/client HTML mismatch.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = saved ?? (systemPrefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

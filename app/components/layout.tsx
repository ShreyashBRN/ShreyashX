// app/components/layout.tsx
//
// This is what scopes dark mode to just this section. Wrapping here (not
// in your root app/layout.tsx) means ThemeProvider — and therefore the
// `dark` class and localStorage key — only ever gets touched by code under
// /components. Nothing else in your app changes.

import { ThemeProvider } from "@/contexts/ThemeContext";

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

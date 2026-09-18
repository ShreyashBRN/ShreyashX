"use client";

import {
  LiquidScrollProgress,
  type LiquidScrollProgressSection,
} from "@/components/liquid-scroll-progress";

const sections: LiquidScrollProgressSection[] = [
  { title: "Introduction" },
  { title: "Implementation" },
  { title: "Customization" },
  { title: "Usage" },
];

export default function LiquidScrollProgressPreview() {
  return <LiquidScrollProgress sections={sections} />;
}
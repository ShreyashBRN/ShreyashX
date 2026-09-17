"use client";

import { Buttons, type VariantEntry } from "@/components/buttons";

const variants: VariantEntry[] = [
  { variant: "letters", name: "Staggered Letter Lift" },
  { variant: "liquid", name: "Single Liquid Bubble" },
  { variant: "magnetic", name: "Magnetic" },
  { variant: "compression", name: "Cursor Compression" },
  // remove or reorder any entry above to change what the grid shows
];

export default function ButtonsPreview() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <Buttons variants={variants} />
    </div>
  );
}
"use client";

import DragDropReorderPreview from "@/components/drag-drop-reorder-preview";
import LiquidScrollProgressPreview from "@/components/liquid-scroll-progress-preview";
import JellyToolbarPreview from "@/components/jelly-toolbar-preview";
import PaginationPreview from "@/components/pagination-preview";

const previewMap: Record<string, React.ReactNode> = {
  "drag-drop-reorder": <DragDropReorderPreview />,
  "liquid-scroll-progress": <LiquidScrollProgressPreview />,
  "jelly-toolbar": <JellyToolbarPreview />,
  "pagination": <PaginationPreview />,
};

export function ComponentPreview({ slug }: { slug: string }) {
  return (
    previewMap[slug] ?? (
      <span className="text-sm text-neutral-400 dark:text-neutral-500">
        Live preview renders here
      </span>
    )
  );
}
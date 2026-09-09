// "use client";

// import { DragDropReorder } from "@/components/drag-drop-reorder";

// // Add one line here each time you wire up a new component's live preview.
// // Anything not listed just falls back to the placeholder text below —
// // so adding a new component to data/components.ts never breaks this file.
// const previewMap: Record<string, React.ReactNode> = {
//   "drag-drop-reorder": <DragDropReorder />,
// };

// export function ComponentPreview({ slug }: { slug: string }) {
//   return (
//     previewMap[slug] ?? (
//       <span className="text-sm text-neutral-400 dark:text-neutral-500">
//         Live preview renders here
//       </span>
//     )
//   );
// }






"use client";

import DragDropReorderPreview from "@/components/drag-drop-reorder-preview";

// Add one line here each time you wire up a new component's live preview.
// Each entry should point to that component's dedicated -preview.tsx file,
// not the raw component itself, so the docs page can add wrapper/theme
// logic without touching the distributed source.
const previewMap: Record<string, React.ReactNode> = {
  "drag-drop-reorder": <DragDropReorderPreview />,
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
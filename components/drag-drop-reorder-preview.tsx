"use client";

import { DragDropReorder } from "@/components/drag-drop-reorder";

export default function DragDropReorderPreview() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <DragDropReorder />
    </div>
  );
}
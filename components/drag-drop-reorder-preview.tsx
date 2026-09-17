"use client";

import { useState } from "react";
import { DragDropReorder } from "@/components/drag-drop-reorder";
import type { ReorderItem } from "@/components/drag-drop-reorder";
import { Image, Code2, TerminalSquare, CloudUpload, RefreshCw } from "lucide-react";

const initialItems: ReorderItem[] = [
  { id: "design", title: "Design", description: "Create beautiful experiences", icon: Image, color: "pink" },
  { id: "develop", title: "Develop", description: "Build with modern tools", icon: Code2, color: "blue" },
  { id: "test", title: "Test", description: "Ensure everything works", icon: TerminalSquare, color: "neutral" },
  { id: "deploy", title: "Deploy", description: "Launch to the world", icon: CloudUpload, color: "violet" },
  { id: "iterate", title: "Iterate", description: "Make it better", icon: RefreshCw, color: "orange" },
];

export default function DragDropReorderPreview() {
  const [items, setItems] = useState<ReorderItem[]>(initialItems);

  return (
    <div className="flex w-full items-center justify-center p-4">
      <DragDropReorder items={items} onReorder={setItems} />
    </div>
  );
}
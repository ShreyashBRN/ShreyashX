"use client";

import * as React from "react";
import { Reorder } from "framer-motion";
import {
  GripVertical,
  ChevronRight,
  Image,
  Code2,
  TerminalSquare,
  CloudUpload,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

export type ReorderColor = "pink" | "blue" | "violet" | "orange" | "neutral";

export interface ReorderItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: ReorderColor;
}

const defaultItems: ReorderItem[] = [
  { id: "design", title: "Design", description: "Create beautiful experiences", icon: Image, color: "pink" },
  { id: "develop", title: "Develop", description: "Build with modern tools", icon: Code2, color: "blue" },
  { id: "test", title: "Test", description: "Ensure everything works", icon: TerminalSquare, color: "neutral" },
  { id: "deploy", title: "Deploy", description: "Launch to the world", icon: CloudUpload, color: "violet" },
  { id: "iterate", title: "Iterate", description: "Make it better", icon: RefreshCw, color: "orange" },
];

const colorMap: Record<ReorderColor, string> = {
  pink: "bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400",
  neutral: "bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white",
};

export interface DragDropReorderProps {
  items?: ReorderItem[];
  onReorder?: (items: ReorderItem[]) => void;
  className?: string;
}

export function DragDropReorder({ items, onReorder, className = "" }: DragDropReorderProps) {
  const [internalItems, setInternalItems] = React.useState<ReorderItem[]>(defaultItems);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);

  const isControlled = Array.isArray(items);
  const values = isControlled ? (items as ReorderItem[]) : internalItems;
  const setValues = isControlled ? (onReorder as (items: ReorderItem[]) => void) : setInternalItems;

  return (
    <Reorder.Group axis="y" values={values} onReorder={setValues} className={`flex flex-col gap-3 ${className}`}>
      {values.map((item) => {
        const Icon = item.icon;
        const isDragging = draggingId === item.id;

        return (
          <Reorder.Item
            key={item.id}
            value={item}
            onDragStart={() => setDraggingId(item.id)}
            onDragEnd={() => setDraggingId(null)}
            whileDrag={{ scale: 1.02, cursor: "grabbing" }}
            className={[
              "relative flex items-center gap-4 rounded-2xl px-4 py-3.5 select-none",
              "bg-white dark:bg-neutral-900",
              "border border-neutral-100 dark:border-neutral-800",
              isDragging
                ? "ring-2 ring-violet-500/60 shadow-[0_0_24px_rgba(56,189,248,0.35)]"
                : "shadow-sm",
            ].join(" ")}
          >
            <div className="cursor-grab active:cursor-grabbing touch-none text-neutral-300 dark:text-neutral-600" aria-hidden="true">
              <GripVertical size={18} />
            </div>

            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorMap[item.color] ?? colorMap.neutral}`}>
              <Icon size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold leading-tight text-neutral-900 dark:text-neutral-50">{item.title}</div>
              <div className="text-sm leading-tight mt-0.5 text-neutral-500 dark:text-neutral-400">{item.description}</div>
            </div>

            <ChevronRight size={18} className="text-neutral-300 dark:text-neutral-600 shrink-0" />
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
}

export { defaultItems as dragDropReorderDefaultItems };
export default DragDropReorder;
"use client";

// components/ui/PreviewPanel.tsx
//
// Pulled out of app/components/[slug]/page.tsx because it needs local state
// (is the fullscreen overlay open) and that page is an async Server
// Component — Server Components can't hold useState. This owns: the
// Preview/Code tabs, the maximize button, and the fullscreen modal.

import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { Tabs } from "./Tabs";
import { CodeBlock } from "./CodeBlock";
import { ComponentPreview } from "@/components/ComponentPreview";

export function PreviewPanel({ slug, code }: { slug: string; code: string }) {
  const [fullscreen, setFullscreen] = useState(false);

  // Escape key closes it, and we lock body scroll while it's open so the
  // page behind it doesn't scroll along with the modal content.
  useEffect(() => {
    if (!fullscreen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFullscreen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  return (
    <>
      <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/50">
        <Tabs
          variant="underline"
          rightSlot={
            <button
              onClick={() => setFullscreen(true)}
              aria-label="Fullscreen preview"
              className="text-neutral-400 hover:text-[#0d7d86] dark:text-neutral-500 dark:hover:text-[#2dd4bf]"
            >
              <Maximize2 size={16} />
            </button>
          }
          tabs={[
            {
              id: "preview",
              label: "Preview",
              content: (
                <div className="flex min-h-[280px] min-w-0 max-w-full items-center justify-center overflow-x-auto py-12">
                  <ComponentPreview slug={slug} />
                </div>
              ),
            },
            {
              id: "code",
              label: "Code",
              // borderless blends code directly into the preview panel without an inner card
              content: <CodeBlock code={code} borderless maxHeight="420px" />,
            },
          ]}
        />
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 sm:p-8"
          onClick={() => setFullscreen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <span className="text-base font-medium text-neutral-900 dark:text-neutral-100">
                Fullscreen Preview
              </span>
              <button
                onClick={() => setFullscreen(false)}
                aria-label="Close fullscreen preview"
                className="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center overflow-auto p-8">
              <ComponentPreview slug={slug} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
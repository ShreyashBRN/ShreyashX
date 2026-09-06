"use client";

// components/ui/InstallCommandBlock.tsx
//
// Pulled out of app/components/[slug]/page.tsx on purpose: that page is a
// Server Component (it does data lookup + generateMetadata), and Server
// Components cannot contain onClick handlers directly — only Client
// Components can. Keeping this as its own "use client" file lets the page
// stay a server component everywhere else, which is better for perf.

import { Copy } from "lucide-react";
import { useState } from "react";

export function InstallCommandBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      {/* overflow-x-auto scoped to the <code> only, so a long URL scrolls
          sideways inside this pill instead of widening the whole page —
          this is the exact fix for the cut-off command in image 6. */}
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-neutral-800">
        {command}
      </code>
      <button
        aria-label="Copy install command"
        onClick={handleCopy}
        className="shrink-0 rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-500 hover:text-[#0d7d86]"
      >
        {copied ? <span className="block h-3.5 w-3.5 text-[10px] leading-[14px] text-[#0d7d86]">✓</span> : <Copy size={14} />}
      </button>
    </div>
  );
}

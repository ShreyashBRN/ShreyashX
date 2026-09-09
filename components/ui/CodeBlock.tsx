"use client";

// components/ui/CodeBlock.tsx

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: "tsx" | "ts" | "bash";
  className?: string;
  /** Shows a header bar with this filename above the code */
  filename?: string;
  /** Caps the code box height; content beyond this scrolls vertically. Default 420px. */
  maxHeight?: string;
  /** When true, removes the outer card border/background so it blends directly into parent containers like PreviewPanel */
  borderless?: boolean;
}

const CLASS = {
  keyword: "text-purple-600 dark:text-purple-400 font-medium",
  string: "text-emerald-600 dark:text-emerald-400",
  comment: "text-neutral-400 italic dark:text-neutral-500",
  component: "text-amber-600 dark:text-amber-400 font-semibold",
  type: "text-sky-500 dark:text-sky-400",
  punctuation: "text-neutral-400 dark:text-neutral-500",
  plain: "text-neutral-800 dark:text-neutral-200",
};

const KEYWORDS = [
  "import", "export", "from", "const", "let", "var", "function", "return",
  "if", "else", "useState", "useEffect", "useRef", "default", "async", "await",
  "type", "interface", "extends", "implements", "as", "typeof",
];
const TYPES = ["Array", "string", "number", "boolean", "object", "void", "any", "Record", "ReactNode", "Promise", "LucideIcon"];

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code: string): string {
  const lines = code.split("\n");
  return lines
    .map((line) => {
      let out = "";
      let i = 0;
      while (i < line.length) {
        const rest = line.slice(i);

        const commentMatch = rest.match(/^\/\/.*/);
        if (commentMatch) {
          out += `<span class="${CLASS.comment}">${escapeHtml(commentMatch[0])}</span>`;
          i += commentMatch[0].length;
          continue;
        }

        const stringMatch = rest.match(/^("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/);
        if (stringMatch) {
          out += `<span class="${CLASS.string}">${escapeHtml(stringMatch[0])}</span>`;
          i += stringMatch[0].length;
          continue;
        }

        const componentMatch = rest.match(/^(<\/?)([A-Z][A-Za-z0-9]*)/);
        if (componentMatch) {
          out += `<span class="${CLASS.punctuation}">${escapeHtml(componentMatch[1])}</span><span class="${CLASS.component}">${escapeHtml(componentMatch[2])}</span>`;
          i += componentMatch[0].length;
          continue;
        }

        const wordMatch = rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
        if (wordMatch) {
          const word = wordMatch[0];
          if (KEYWORDS.includes(word)) {
            out += `<span class="${CLASS.keyword}">${escapeHtml(word)}</span>`;
          } else if (TYPES.includes(word)) {
            out += `<span class="${CLASS.type}">${escapeHtml(word)}</span>`;
          } else {
            out += `<span class="${CLASS.plain}">${escapeHtml(word)}</span>`;
          }
          i += word.length;
          continue;
        }

        out += `<span class="${CLASS.punctuation}">${escapeHtml(rest[0])}</span>`;
        i += 1;
      }
      return out || "&nbsp;";
    })
    .join("\n");
}

export function CodeBlock({
  code,
  className = "",
  filename,
  maxHeight = "420px",
  borderless = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const handleScroll = (e: React.UIEvent<HTMLPreElement>) => {
    const scrolled = e.currentTarget.scrollTop > 10;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  };

  const containerClasses = borderless
    ? `group relative min-w-0 max-w-full ${className}`
    : `group relative min-w-0 max-w-full overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-900/40 ${className}`;

  return (
    <div className={containerClasses} data-lenis-prevent>
      {filename && (
        <div className="flex h-9 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{filename}</span>
        </div>
      )}

      {/* Floating Copy Button — visible on hover at top, disappears when scrolled down */}
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        title="Copy code"
        className={`absolute z-20 flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200/90 bg-white/95 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-neutral-300 hover:bg-white dark:border-neutral-700/80 dark:bg-neutral-800/95 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 ${
          isScrolled
            ? "pointer-events-none opacity-0 scale-95"
            : copied
            ? "opacity-100 scale-100 text-[#0d7d86] dark:text-[#2dd4bf]"
            : "opacity-0 group-hover:opacity-100 scale-100 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        } ${filename ? "right-2.5 top-11" : "right-1 top-1 sm:right-1.5 sm:top-1.5"}`}
      >
        {copied ? (
          <Check size={14} strokeWidth={2.5} />
        ) : (
          <Copy size={14} strokeWidth={1.75} />
        )}
      </button>

      {/* Code viewport — scrollable vertically and horizontally, isolated from Lenis */}
      <pre
        onScroll={handleScroll}
        data-lenis-prevent
        className={`min-w-0 max-w-full overflow-x-auto overflow-y-auto whitespace-pre font-mono text-[13px] leading-relaxed text-neutral-800 overscroll-contain dark:text-neutral-200 selection:bg-[#0d7d86]/20 dark:selection:bg-[#2dd4bf]/30 ${
          borderless ? "p-1 sm:p-2" : "p-4"
        }`}
        style={{ maxHeight }}
      >
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}
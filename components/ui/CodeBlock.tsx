"use client";

// components/ui/CodeBlock.tsx
//
// Two additions from before: an optional `filename` header bar (matches
// the "floating-toolbar.jsx" look in your Manual-tab screenshot), and a
// `maxHeight` cap so long code scrolls INSIDE the box vertically instead
// of pushing the whole page taller — same principle as the horizontal-
// scroll fix, just on the other axis.

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: "tsx" | "ts" | "bash";
  className?: string;
  /** Shows a header bar with this filename above the code, copy button moves into that bar */
  filename?: string;
  /** Caps the code box height; content beyond this scrolls vertically. Default 420px. */
  maxHeight?: string;
}

const CLASS = {
  keyword: "text-purple-500 dark:text-purple-400",
  string: "text-emerald-600 dark:text-emerald-400",
  comment: "text-neutral-400 italic dark:text-neutral-500",
  component: "text-amber-600 dark:text-amber-400",
  type: "text-sky-500 dark:text-sky-400",
  punctuation: "text-neutral-400 dark:text-neutral-500",
  plain: "text-neutral-800 dark:text-neutral-200",
};

const KEYWORDS = [
  "import", "export", "from", "const", "let", "var", "function", "return",
  "if", "else", "useState", "useEffect", "useRef", "default", "async", "await",
];
const TYPES = ["Array", "string", "number", "boolean", "object", "void", "any"];

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

export function CodeBlock({ code, className = "", filename, maxHeight = "420px" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const copyIcon = copied ? (
    <span className="block h-4 w-4 text-[10px] leading-4 text-[#0d7d86] dark:text-[#2dd4bf]">✓</span>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );

  return (
    <div className={`relative min-w-0 max-w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}>
      {filename ? (
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{filename}</span>
          <button
            onClick={handleCopy}
            aria-label="Copy code"
            className="rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-500 shadow-sm hover:text-[#0d7d86] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-[#2dd4bf]"
          >
            {copyIcon}
          </button>
        </div>
      ) : (
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="absolute right-3 top-3 z-10 rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-500 shadow-sm hover:text-[#0d7d86] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-[#2dd4bf]"
        >
          {copyIcon}
        </button>
      )}

      {/* overflow-x-auto handles long lines; maxHeight + overflow-y-auto
          handles long files — both scoped to this box, never the page. */}
      <pre
        className={`min-w-0 max-w-full overflow-auto p-4 font-mono text-[13px] leading-relaxed ${filename ? "" : "pr-12"}`}
        style={{ maxHeight }}
      >
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}
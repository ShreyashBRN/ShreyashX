"use client";

// components/ui/CodeBlock.tsx
//
// A self-contained code block: syntax highlighting via a small regex
// tokenizer (no extra dependency), a copy button, and — this is the part
// that matters for your "cut off on mobile" bug — horizontal scroll that
// is CONTAINED to the code box instead of blowing out the page width.
//
// The root cause of the bug in your screenshots is almost always a flex
// child without `min-w-0`: flex items default to `min-width: auto`, so a
// long unbroken line of code refuses to shrink and pushes its parent wider
// than the viewport, which is what causes the whole page (not just the
// code box) to scroll sideways. Fix: `min-w-0` on every flex ancestor of
// the code block, and `overflow-x-auto max-w-full` on the block itself.
//
// If you want production-grade highlighting (multi-line strings, JSX
// edge cases, more languages), swap the `highlight()` function below for
// `shiki` or `rehype-pretty-code` — the component's public API (code, lang)
// stays the same either way.

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: "tsx" | "ts" | "bash";
  className?: string;
}

// Token categories -> Tailwind classes, tuned to match your screenshots
const CLASS = {
  keyword: "text-purple-500",       // import, from, const, function, return
  string: "text-emerald-600",       // "use client", 'react', etc.
  comment: "text-neutral-400 italic",
  component: "text-amber-600",      // Capitalized JSX tags / component names
  type: "text-sky-500",             // Array, string, number, boolean
  punctuation: "text-neutral-400",
  plain: "text-neutral-800 dark:text-neutral-200",
};

const KEYWORDS = [
  "import", "export", "from", "const", "let", "var", "function", "return",
  "if", "else", "useState", "useEffect", "useRef", "default", "async", "await",
];
const TYPES = ["Array", "string", "number", "boolean", "object", "void", "any"];

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlight(code: string): string {
  const lines = code.split("\n");
  return lines
    .map((line) => {
      let out = "";
      let i = 0;
      while (i < line.length) {
        const rest = line.slice(i);

        // Line comment
        const commentMatch = rest.match(/^\/\/.*/);
        if (commentMatch) {
          out += `<span class="${CLASS.comment}">${escapeHtml(commentMatch[0])}</span>`;
          i += commentMatch[0].length;
          continue;
        }

        // Strings (double, single, template)
        const stringMatch = rest.match(/^("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/);
        if (stringMatch) {
          out += `<span class="${CLASS.string}">${escapeHtml(stringMatch[0])}</span>`;
          i += stringMatch[0].length;
          continue;
        }

        // JSX tag / Capitalized component name
        const componentMatch = rest.match(/^(<\/?)([A-Z][A-Za-z0-9]*)/);
        if (componentMatch) {
          out += `<span class="${CLASS.punctuation}">${escapeHtml(componentMatch[1])}</span><span class="${CLASS.component}">${escapeHtml(componentMatch[2])}</span>`;
          i += componentMatch[0].length;
          continue;
        }

        // Word (identifier / keyword / type)
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

        // Punctuation / whitespace / everything else, one char at a time
        out += `<span class="${CLASS.punctuation}">${escapeHtml(rest[0])}</span>`;
        i += 1;
      }
      return out || "&nbsp;";
    })
    .join("\n");
}

export function CodeBlock({ code, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    // min-w-0 is load-bearing here: without it, this box refuses to
    // shrink below its content width inside any flex/grid ancestor.
    <div className={`relative min-w-0 max-w-full rounded-xl border border-neutral-200 bg-neutral-50 ${className}`}>
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className="absolute right-3 top-3 z-10 rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-500 shadow-sm hover:text-[#0d7d86]"
      >
        {copied ? (
          <span className="block h-4 w-4 text-[10px] leading-4 text-[#0d7d86]">✓</span>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
      {/* overflow-x-auto is scoped to this element only — the page itself
          never needs to scroll sideways because of a code block. */}
      <pre className="min-w-0 max-w-full overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}

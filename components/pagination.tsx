"use client"

/**
 * ============================================================================
 * Pagination
 * ============================================================================
 * Renders four visually distinct pagination styles — Pills, Outline, Compact,
 * With Input — as four COMPLETELY INDEPENDENT instances. Each one owns its
 * own page state and its own Framer Motion LayoutGroup, so interacting with
 * one never affects, and never animates into, another.
 *
 * WHY THIS FILE HAS NO JSX
 * ------------------------------------------------------------------------
 * This file ends in `.ts`, not `.tsx`. TypeScript's parser only allows JSX
 * syntax (`<svg>`, `<div>...</div>`, etc.) inside `.tsx` files — in a plain
 * `.ts` file that syntax is a parse error ("Expected '>', got 'ident'"),
 * which is exactly the build error this version fixes. Every element below
 * is built with `React.createElement(...)` instead of JSX tags. The
 * component's behavior, props, and output are otherwise identical to the
 * JSX version — this is a mechanical syntax translation, not a rewrite.
 *
 * All pagination LOGIC (getPageRange, usePageWindow, usePaginationState, the
 * onChange wiring, the four independent LayoutGroups, the active-indicator
 * animation) and all layout/styling classes are unchanged from the last
 * approved visual pass.
 * ============================================================================
 */

import * as React from "react"
import { motion, LayoutGroup, type Transition } from "framer-motion"

const h = React.createElement

// ---------------------------------------------------------------------------
// cn() — replace with your project's own class-name merge utility if you
// already have one (e.g. `import { cn } from "@/lib/utils"`).
// ---------------------------------------------------------------------------
function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ")
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Which single variant to render. Omit `variant` to render all four independent instances. */
export type PaginationVariant = "pills" | "outline" | "compact" | "input"
const DEFAULT_VARIANTS: PaginationVariant[] = ["pills", "outline", "compact", "input"]

export interface PaginationProps {
  /** Total number of pages. */
  totalPages?: number
  /**
   * Controlled current page (1-indexed). Only meaningful when `variant` is
   * also set — the four-instance showcase mode never accepts a shared page,
   * since that would reintroduce cross-instance state sharing.
   */
  page?: number
  /** Uncontrolled initial page (1-indexed). Ignored if `page` is provided. */
  defaultPage?: number
  /** Alias of `defaultPage`. In showcase mode, this seeds all four instances' *initial* page — they still diverge independently after that. */
  initialPage?: number
  /** Called whenever the page changes. Only used in single-variant mode. */
  onPageChange?: (page: number) => void
  /** Render only this single variant instead of the four-instance showcase. */
  variant?: PaginationVariant
  /** Which variants to render in showcase mode (used only when `variant` is not set). Defaults to all four, in this order. */
  variants?: PaginationVariant[]
  showInput?: boolean
  /** Disable every control. */
  disabled?: boolean
  /** How many pages to show on each side of the current page (desktop). Automatically reduced to 1 on narrow viewports. Default 2. */
  siblingCount?: number
  /** Extra classes applied to the outermost wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// Shared page-range algorithm — LOCKED, UNCHANGED
// ---------------------------------------------------------------------------

type PageItem = number | "ellipsis"

function getPageRange(
  current: number,
  total: number,
  siblingCount: number,
  boundaryCount: number
): PageItem[] {
  const safeTotal = Math.max(1, Math.floor(total))
  const safeCurrent = Math.min(Math.max(1, Math.floor(current)), safeTotal)
  const safeSiblingCount = Math.max(0, Math.floor(siblingCount))
  const safeBoundaryCount = Math.max(0, Math.floor(boundaryCount))
  const clamp = (n: number) => Math.min(Math.max(n, 1), safeTotal)

  const visible = new Set<number>()
  for (let i = 1; i <= Math.min(safeBoundaryCount, safeTotal); i++) visible.add(i)
  for (let i = Math.max(safeTotal - safeBoundaryCount + 1, 1); i <= safeTotal; i++) visible.add(i)
  for (let i = clamp(safeCurrent - safeSiblingCount); i <= clamp(safeCurrent + safeSiblingCount); i++) {
    visible.add(i)
  }
  visible.add(1)
  visible.add(safeTotal)

  const sorted = Array.from(visible).sort((a, b) => a - b)
  const items: PageItem[] = []

  sorted.forEach((num, idx) => {
    if (idx > 0) {
      const prev = sorted[idx - 1]
      const gap = num - prev
      if (gap === 2) {
        items.push(prev + 1)
      } else if (gap > 2) {
        items.push("ellipsis")
      }
    }
    items.push(num)
  })

  return items
}

function usePageWindow(
  page: number,
  totalPages: number,
  siblingCount: number,
  isCompact: boolean
): PageItem[] {
  const effectiveSibling = isCompact ? Math.min(siblingCount, 1) : siblingCount
  return React.useMemo(
    () => getPageRange(page, totalPages, effectiveSibling, 1),
    [page, totalPages, effectiveSibling]
  )
}

// ---------------------------------------------------------------------------
// Shared hooks — LOCKED, UNCHANGED
// ---------------------------------------------------------------------------

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener("change", listener)
    return () => query.removeEventListener("change", listener)
  }, [])

  return reduced
}

function useIsCompactViewport(breakpointPx = 480): boolean {
  const [isCompact, setIsCompact] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpointPx}px)`)
    setIsCompact(query.matches)
    const listener = (event: MediaQueryListEvent) => setIsCompact(event.matches)
    query.addEventListener("change", listener)
    return () => query.removeEventListener("change", listener)
  }, [breakpointPx])

  return isCompact
}

function useIndicatorTransition(): Transition {
  const reducedMotion = usePrefersReducedMotion()
  if (reducedMotion) return { duration: 0 }
  return { type: "spring", stiffness: 500, damping: 40, mass: 0.8 }
}

function usePaginationState({
  totalPages,
  page: controlledPage,
  defaultPage,
  onPageChange,
}: {
  totalPages: number
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
}) {
  const isControlled = controlledPage !== undefined
  const [internalPage, setInternalPage] = React.useState(defaultPage ?? 1)
  const page = isControlled ? (controlledPage as number) : internalPage

  const setPage = React.useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 1), Math.max(1, totalPages))
      if (!isControlled) setInternalPage(clamped)
      onPageChange?.(clamped)
    },
    [isControlled, totalPages, onPageChange]
  )

  return [page, setPage] as const
}

// ---------------------------------------------------------------------------
// Small shared icons — LOCKED, UNCHANGED (built with createElement, not JSX)
// ---------------------------------------------------------------------------

function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return h(
    "svg",
    { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", ...props },
    h("path", {
      d: "M15 6l-6 6 6 6",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  )
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return h(
    "svg",
    { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", ...props },
    h("path", {
      d: "M9 6l6 6-6 6",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    })
  )
}

// ---------------------------------------------------------------------------
// Props shared by every variant renderer
// ---------------------------------------------------------------------------

interface VariantProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  disabled?: boolean
  siblingCount: number
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"

// Pointer cursor when enabled, "not-allowed" when disabled — applied to
// every Prev/Next/page-number/Go control across all four variants.
const interactiveCursor = "cursor-pointer disabled:cursor-not-allowed"

// Small helper: render the shared "…" ellipsis item used between page
// number buttons. `tag` lets callers ask for an `li` (inside a `<ul>`) or a
// plain `span` (Outline uses a `div`, not a `ul`, for its number row).
function renderEllipsis(tag: "li" | "span", key: string, className: string) {
  return h(tag, { key, className }, "\u2026")
}

/* =============================================================================
 * VARIANT 1 — PILLS
 * [Prev circle] [numbers pill] [Next circle] are wrapped together in one
 * inline-flex (fit-content) group, centered inside the full-width row. The
 * group only takes the space it needs — that's what keeps the arrows close
 * to the numbers instead of pinned to the row's outer edges.
 * ===========================================================================*/
function PillsPagination({ page, totalPages, onChange, disabled, siblingCount }: VariantProps) {
  const transition = useIndicatorTransition()
  const isCompact = useIsCompactViewport()
  const items = usePageWindow(page, totalPages, siblingCount, isCompact)

  const prevButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Previous page",
      disabled: disabled || page <= 1,
      onClick: () => onChange(page - 1),
      className: cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-neutral-500 shadow-sm ring-1 ring-black/5 transition-colors",
        "max-[480px]:h-9 max-[480px]:w-9",
        "hover:text-neutral-900 disabled:opacity-40 disabled:hover:text-neutral-500",
        "dark:bg-neutral-800 dark:text-neutral-400 dark:ring-white/10 dark:hover:text-white",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronLeftIcon, { className: "h-4 w-4" })
  )

  const nextButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Next page",
      disabled: disabled || page >= totalPages,
      onClick: () => onChange(page + 1),
      className: cn(
        "grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-neutral-500 shadow-sm ring-1 ring-black/5 transition-colors",
        "max-[480px]:h-9 max-[480px]:w-9",
        "hover:text-neutral-900 disabled:opacity-40 disabled:hover:text-neutral-500",
        "dark:bg-neutral-800 dark:text-neutral-400 dark:ring-white/10 dark:hover:text-white",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronRightIcon, { className: "h-4 w-4" })
  )

  const numberItems = items.map((item, index) => {
    if (item === "ellipsis") {
      return renderEllipsis(
        "li",
        `ellipsis-${index}`,
        "grid h-9 w-5 shrink-0 place-items-center text-sm text-neutral-400 max-[480px]:h-8 max-[480px]:w-4 max-[480px]:text-xs dark:text-neutral-500"
      )
    }
    const isActive = item === page
    return h(
      "li",
      { key: item, className: "shrink-0" },
      h(
        "button",
        {
          type: "button",
          disabled: disabled,
          "aria-current": isActive ? "page" : undefined,
          "aria-label": `Go to page ${item}`,
          onClick: () => onChange(item),
          className: cn(
            "relative grid h-9 w-9 place-items-center rounded-full text-sm font-medium transition-colors max-[480px]:h-8 max-[480px]:w-8 max-[480px]:text-xs",
            isActive ? "text-white" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700/60",
            interactiveCursor,
            focusRing
          ),
        },
        isActive &&
          h(motion.span, {
            layoutId: "pills-active",
            transition,
            className: "absolute inset-0 rounded-full bg-indigo-600",
          }),
        h("span", { className: "relative z-10" }, item)
      )
    )
  })

  const numbersList = h(
    "ul",
    {
      className:
        "flex shrink-0 items-center gap-1 overflow-hidden rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-black/5 max-[480px]:gap-0.5 max-[480px]:px-2 max-[480px]:py-1 dark:bg-neutral-800 dark:ring-white/10",
    },
    numberItems
  )

  const group = h(
    "div",
    { className: "inline-flex max-w-full items-center gap-3 max-[480px]:gap-1.5" },
    prevButton,
    numbersList,
    nextButton
  )

  return h("nav", { "aria-label": "Pagination", className: "flex w-full items-center justify-center" }, group)
}

/* =============================================================================
 * VARIANT 2 — OUTLINE
 * The bordered box is a fit-content group (matching Pills' width) centered
 * inside the full-width row — not stretched to the row's edges. Padding is
 * sized so the border always has room around the 32px buttons.
 * ===========================================================================*/
function OutlinePagination({ page, totalPages, onChange, disabled, siblingCount }: VariantProps) {
  const transition = useIndicatorTransition()
  const isCompact = useIsCompactViewport()
  const items = usePageWindow(page, totalPages, siblingCount, isCompact)

  const prevButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Previous page",
      disabled: disabled || page <= 1,
      onClick: () => onChange(page - 1),
      className: cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-indigo-600 transition-colors max-[480px]:h-7 max-[480px]:w-7",
        "hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent",
        "dark:text-indigo-400 dark:hover:bg-indigo-500/10",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronLeftIcon, { className: "h-4 w-4" })
  )

  const nextButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Next page",
      disabled: disabled || page >= totalPages,
      onClick: () => onChange(page + 1),
      className: cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-indigo-600 transition-colors max-[480px]:h-7 max-[480px]:w-7",
        "hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent",
        "dark:text-indigo-400 dark:hover:bg-indigo-500/10",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronRightIcon, { className: "h-4 w-4" })
  )

  const numberItems = items.map((item, index) => {
    if (item === "ellipsis") {
      return renderEllipsis(
        "span",
        `ellipsis-${index}`,
        "grid h-8 w-5 shrink-0 place-items-center text-sm text-neutral-400 max-[480px]:h-7 max-[480px]:w-4 max-[480px]:text-xs dark:text-neutral-500"
      )
    }
    const isActive = item === page
    return h(
      "button",
      {
        key: item,
        type: "button",
        disabled: disabled,
        "aria-current": isActive ? "page" : undefined,
        "aria-label": `Go to page ${item}`,
        onClick: () => onChange(item),
        className: cn(
          "relative grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-medium transition-colors max-[480px]:h-7 max-[480px]:w-7 max-[480px]:text-xs",
          isActive
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
          interactiveCursor,
          focusRing
        ),
      },
      isActive &&
        h(motion.span, {
          layoutId: "outline-active",
          transition,
          className: "absolute inset-0 rounded-lg ring-2 ring-indigo-600 dark:ring-indigo-400",
        }),
      h("span", { className: "relative z-10" }, item)
    )
  })

  const numbersRow = h("div", { className: "flex shrink-0 items-center gap-1 py-0.5" }, numberItems)

  const box = h(
    "div",
    {
      className: cn(
        "box-border inline-flex max-w-full items-center gap-5 rounded-2xl border border-neutral-200 bg-white px-8 py-2 shadow-sm",
        "max-[480px]:gap-1 max-[480px]:px-2 max-[480px]:py-2",
        "dark:border-neutral-800 dark:bg-neutral-900"
      ),
    },
    prevButton,
    numbersRow,
    nextButton
  )

  return h("nav", { "aria-label": "Pagination", className: "flex w-full items-center justify-center" }, box)
}

/* =============================================================================
 * VARIANT 3 — COMPACT
 * A single fit-content box (numbers, then a small gap, then the Prev/Next
 * pair), centered inside the row.
 * ===========================================================================*/
function CompactPagination({ page, totalPages, onChange, disabled, siblingCount }: VariantProps) {
  const transition = useIndicatorTransition()
  const isCompact = useIsCompactViewport()
  const items = usePageWindow(page, totalPages, siblingCount, isCompact)

  const numberItems = items.map((item, index) => {
    if (item === "ellipsis") {
      return renderEllipsis(
        "li",
        `ellipsis-${index}`,
        "grid h-7 w-4 shrink-0 place-items-center text-xs text-neutral-400 dark:text-neutral-500"
      )
    }
    const isActive = item === page
    return h(
      "li",
      { key: item, className: "shrink-0" },
      h(
        "button",
        {
          type: "button",
          disabled: disabled,
          "aria-current": isActive ? "page" : undefined,
          "aria-label": `Go to page ${item}`,
          onClick: () => onChange(item),
          className: cn(
            "relative grid h-7 w-7 place-items-center rounded-md text-xs font-medium transition-colors max-[480px]:h-6 max-[480px]:w-6",
            isActive ? "text-white" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
            interactiveCursor,
            focusRing
          ),
        },
        isActive &&
          h(motion.span, {
            layoutId: "compact-active",
            transition,
            className: "absolute inset-0 rounded-md bg-indigo-600",
          }),
        h("span", { className: "relative z-10" }, item)
      )
    )
  })

  const numbersList = h("ul", { className: "flex shrink-0 items-center gap-1" }, numberItems)

  const prevButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Previous page",
      disabled: disabled || page <= 1,
      onClick: () => onChange(page - 1),
      className: cn(
        "grid h-7 w-7 place-items-center rounded-md bg-neutral-100 text-neutral-500 transition-colors max-[480px]:h-6 max-[480px]:w-6",
        "hover:text-neutral-900 disabled:opacity-40 disabled:hover:text-neutral-500",
        "dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-white",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronLeftIcon, { className: "h-3.5 w-3.5" })
  )

  const nextButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Next page",
      disabled: disabled || page >= totalPages,
      onClick: () => onChange(page + 1),
      className: cn(
        "grid h-7 w-7 place-items-center rounded-md bg-indigo-600 text-white transition-colors max-[480px]:h-6 max-[480px]:w-6",
        "hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronRightIcon, { className: "h-3.5 w-3.5" })
  )

  const controls = h("div", { className: "flex shrink-0 items-center gap-1" }, prevButton, nextButton)

  const box = h(
    "div",
    {
      className: cn(
        "box-border inline-flex max-w-full items-center gap-5 rounded-xl border border-neutral-200 bg-white px-3 py-2 shadow-sm",
        "max-[480px]:gap-3 max-[480px]:px-2 max-[480px]:py-1.5",
        "dark:border-neutral-800 dark:bg-neutral-900"
      ),
    },
    numbersList,
    controls
  )

  return h("nav", { "aria-label": "Pagination", className: "flex w-full items-center justify-center" }, box)
}

/* =============================================================================
 * VARIANT 4 — WITH INPUT
 * Desktop (>480px): ONE fit-content pill containing [Prev, numbers, Next]
 * and the "Go to page" group side by side, centered in the row.
 * Mobile (<=480px): the pill becomes full-width and stacks into two rows —
 * pagination on top, "Go to page" centered underneath.
 * ===========================================================================*/
function InputPagination({
  page,
  totalPages,
  onChange,
  disabled,
  siblingCount,
  showInput = true,
}: VariantProps & { showInput?: boolean }) {
  const transition = useIndicatorTransition()
  const isCompact = useIsCompactViewport()
  const items = usePageWindow(page, totalPages, siblingCount, isCompact)
  const [inputValue, setInputValue] = React.useState("")
  const inputId = React.useId()

  const submitGoTo = () => {
    const parsed = Number.parseInt(inputValue, 10)
    if (Number.isNaN(parsed)) {
      setInputValue("")
      return
    }
    const clamped = Math.min(Math.max(parsed, 1), totalPages)
    onChange(clamped)
    setInputValue("")
  }

  const prevButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Previous page",
      disabled: disabled || page <= 1,
      onClick: () => onChange(page - 1),
      className: cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-neutral-500 transition-colors",
        "hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent",
        "dark:text-neutral-400 dark:hover:bg-neutral-800",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronLeftIcon, { className: "h-4 w-4" })
  )

  const nextButton = h(
    "button",
    {
      type: "button",
      "aria-label": "Next page",
      disabled: disabled || page >= totalPages,
      onClick: () => onChange(page + 1),
      className: cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-neutral-500 transition-colors",
        "hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent",
        "dark:text-neutral-400 dark:hover:bg-neutral-800",
        interactiveCursor,
        focusRing
      ),
    },
    h(ChevronRightIcon, { className: "h-4 w-4" })
  )

  const numberItems = items.map((item, index) => {
    if (item === "ellipsis") {
      return renderEllipsis(
        "li",
        `ellipsis-${index}`,
        "grid h-8 w-4 shrink-0 place-items-center text-sm text-neutral-400 max-[480px]:h-7 max-[480px]:text-xs dark:text-neutral-500"
      )
    }
    const isActive = item === page
    return h(
      "li",
      { key: item, className: "shrink-0" },
      h(
        "button",
        {
          type: "button",
          disabled: disabled,
          "aria-current": isActive ? "page" : undefined,
          "aria-label": `Go to page ${item}`,
          onClick: () => onChange(item),
          className: cn(
            "relative grid h-8 w-8 place-items-center rounded-lg text-sm font-medium transition-colors max-[480px]:h-7 max-[480px]:w-7 max-[480px]:text-xs",
            isActive ? "text-white" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
            interactiveCursor,
            focusRing
          ),
        },
        // Rotated-square "diamond" active shape. The page number itself is
        // counter-rotated back to stay upright; `layout` + independent
        // `rotate` style still animate smoothly together.
        isActive &&
          h(motion.span, {
            layoutId: "input-active",
            layout: true,
            transition,
            style: { rotate: 45 },
            className: "absolute inset-1 rounded-md bg-indigo-600",
          }),
        h("span", { className: "relative z-10" }, item)
      )
    )
  })

  const numbersList = h("ul", { className: "flex shrink-0 items-center gap-1 px-0.5" }, numberItems)

  const nav = h(
    "nav",
    {
      "aria-label": "Pagination",
      className: "inline-flex shrink-0 items-center gap-1 max-[480px]:w-full max-[480px]:justify-center",
    },
    prevButton,
    numbersList,
    nextButton
  )

  const goToForm = showInput
    ? h(
        "form",
        {
          className: "inline-flex shrink-0 items-center gap-2 max-[480px]:w-full max-[480px]:justify-center",
          onSubmit: (event: React.FormEvent) => {
            event.preventDefault()
            submitGoTo()
          },
        },
        h(
          "label",
          {
            htmlFor: inputId,
            className: "whitespace-nowrap text-sm text-neutral-500 max-[480px]:text-xs dark:text-neutral-400",
          },
          "Go to page"
        ),
        h("input", {
          id: inputId,
          type: "text",
          inputMode: "numeric",
          disabled: disabled,
          value: inputValue,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(event.target.value.replace(/[^0-9]/g, "")),
          placeholder: String(page),
          className: cn(
            "h-8 w-14 shrink-0 rounded-lg border border-neutral-200 bg-white px-2 text-center text-sm text-neutral-800 transition-colors max-[480px]:h-7 max-[480px]:w-11 max-[480px]:text-xs",
            "placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100",
            focusRing
          ),
        }),
        h(
          "button",
          {
            type: "submit",
            disabled: disabled || inputValue === "",
            className: cn(
              "flex h-8 shrink-0 items-center gap-1 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white transition-colors max-[480px]:h-7 max-[480px]:px-2 max-[480px]:text-xs",
              "hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600",
              interactiveCursor,
              focusRing
            ),
          },
          "Go",
          h(ChevronRightIcon, { className: "h-3.5 w-3.5" })
        )
      )
    : null

  const box = h(
    "div",
    {
      className: cn(
        "box-border flex max-w-full flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-3 py-2.5 shadow-sm",
        "min-[481px]:w-fit min-[481px]:flex-row min-[481px]:gap-4 min-[481px]:rounded-full min-[481px]:py-2",
        "max-[480px]:w-full",
        "dark:border-neutral-800 dark:bg-neutral-900"
      ),
    },
    nav,
    goToForm
  )

  return h("div", { className: "flex w-full items-center justify-center" }, box)
}

// ---------------------------------------------------------------------------
// PaginationInstance — LOCKED, UNCHANGED. Owns its own state (via
// usePaginationState) and its own LayoutGroup id, so this variant's
// `layoutId="pills-active"` etc. can never be confused with another
// instance's identically-named layoutId, even if you render two Pagination
// showcases on the same page.
// ---------------------------------------------------------------------------
function PaginationInstance({
  variant,
  totalPages,
  initialPage,
  siblingCount,
  disabled,
  showInput,
}: {
  variant: PaginationVariant
  totalPages: number
  initialPage: number
  siblingCount: number
  disabled?: boolean
  showInput?: boolean
}) {
  const groupId = React.useId()
  const [page, setPage] = usePaginationState({ totalPages, defaultPage: initialPage })
  const shared: VariantProps = { page, totalPages, onChange: setPage, disabled, siblingCount }

  let content: React.ReactNode = null
  if (variant === "pills") content = h(PillsPagination, shared)
  else if (variant === "outline") content = h(OutlinePagination, shared)
  else if (variant === "compact") content = h(CompactPagination, shared)
  else if (variant === "input") content = h(InputPagination, { ...shared, showInput: showInput ?? true })

  return h(LayoutGroup, { id: `pagination-${variant}-${groupId}` }, content)
}

/* =============================================================================
 * MAIN COMPONENT
 * ===========================================================================*/
export default function Pagination({
  totalPages = 40,
  page,
  defaultPage,
  initialPage,
  onPageChange,
  variant,
  variants = DEFAULT_VARIANTS,
  showInput = true,
  disabled = false,
  siblingCount = 2,
  className,
}: PaginationProps) {
  // Single-variant mode: exactly one instance, full controlled/uncontrolled
  // API — no multi-instance concerns since there's nothing else to conflict with.
  const singleGroupId = React.useId()
  const [singlePage, setSinglePage] = usePaginationState({
    totalPages,
    page,
    defaultPage: defaultPage ?? initialPage ?? 1,
    onPageChange,
  })

  if (variant) {
    const shared: VariantProps = { page: singlePage, totalPages, onChange: setSinglePage, disabled, siblingCount }
    let content: React.ReactNode = null
    if (variant === "pills") content = h(PillsPagination, shared)
    else if (variant === "outline") content = h(OutlinePagination, shared)
    else if (variant === "compact") content = h(CompactPagination, shared)
    else if (variant === "input") content = h(InputPagination, { ...shared, showInput })

    return h(
      LayoutGroup,
      { id: `pagination-${variant}-${singleGroupId}` },
      h("div", { className: cn("w-full", className) }, content)
    )
  }

  // Showcase mode: four fully independent instances, all sharing one width
  // slot (~860px) for outer alignment. Each variant's own visible box sizes
  // to its content and is centered within that slot. `defaultPage`/
  // `initialPage` only seed each instance's STARTING page — after that,
  // each one's state is entirely its own.
  const seed = defaultPage ?? initialPage ?? 3

  return h(
    "div",
    { className: cn("mx-auto flex w-full max-w-[860px] flex-col gap-7", className) },
    ...variants.map((v) =>
            h(PaginationInstance, {
              key: v,
              variant: v,
              totalPages,
              initialPage: seed,
              siblingCount,
              disabled,
              showInput: v === "input" ? showInput : undefined,
            })
          )
  )
}
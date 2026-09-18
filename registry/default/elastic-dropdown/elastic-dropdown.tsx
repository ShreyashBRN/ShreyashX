"use client"

/**
 * ElasticDropdown — a compact dropdown whose outer surface physically
 * deforms open and closed: a single continuous SVG path stretches,
 * slightly overshoots, and settles, rather than a menu that fades,
 * slides, or scales in on top of a static trigger.
 */

import * as React from "react"

/* ------------------------------------------------------------------ */
/*  icons — small stroke-only line icons, no external dependency       */
/* ------------------------------------------------------------------ */

export type IconComponent = React.FC

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  "aria-hidden": true,
} as const

export const FolderIcon: IconComponent = () => (
  <svg {...iconProps}>
    <path
      d="M2.5 4.8c0-.72.58-1.3 1.3-1.3h2.6l1.2 1.3h4.6c.72 0 1.3.58 1.3 1.3v5.6c0 .72-.58 1.3-1.3 1.3H3.8c-.72 0-1.3-.58-1.3-1.3V4.8Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
)

export const UserIcon: IconComponent = () => (
  <svg {...iconProps}>
    <circle cx="8" cy="5.6" r="2.3" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M3.4 13c.7-2.4 2.6-3.7 4.6-3.7s3.9 1.3 4.6 3.7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)

export const BriefcaseIcon: IconComponent = () => (
  <svg {...iconProps}>
    <rect x="2.3" y="5.6" width="11.4" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M6.2 5.6V4.3a1.8 1.8 0 0 1 1.8-1.8v0a1.8 1.8 0 0 1 1.8 1.8v1.3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path d="M2.3 9h11.4" stroke="currentColor" strokeWidth="1.4" />
  </svg>
)

export const PaletteIcon: IconComponent = () => (
  <svg {...iconProps}>
    <path
      d="M8 2.4a5.6 5.6 0 1 0 0 11.2c.8 0 1.3-.6 1.3-1.2 0-.27-.1-.5-.3-.7-.2-.2-.3-.45-.3-.7 0-.5.5-.9 1-.9h1.1A2.8 2.8 0 0 0 13.6 7c0-2.6-2.5-4.6-5.6-4.6Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="5.4" cy="7.2" r=".6" fill="currentColor" />
    <circle cx="6.7" cy="5" r=".6" fill="currentColor" />
    <circle cx="9.4" cy="5" r=".6" fill="currentColor" />
    <circle cx="10.6" cy="7.2" r=".6" fill="currentColor" />
  </svg>
)

export const CodeIcon: IconComponent = () => (
  <svg {...iconProps}>
    <path
      d="M5.6 4.4 2 8l3.6 3.6M10.4 4.4 14 8l-3.6 3.6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const FinanceIcon: IconComponent = () => (
  <svg {...iconProps}>
    <path
      d="M8 2.5v11M5.2 4.8h3.6a1.7 1.7 0 0 1 0 3.4H7.2a1.7 1.7 0 0 0 0 3.4h3.6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/* ------------------------------------------------------------------ */
/*  filled / colored counterparts — used on hover (mid-rotation) and   */
/*  for the persistent selected state. Same silhouette as the outline  */
/*  versions above, rendered as closed/saturated shapes instead of     */
/*  thin strokes so the hover transformation reads as "outline turns   */
/*  into colorful artwork" rather than an unrelated icon swap.         */
/*  NOTE: no rect/background shapes here — the color belongs to the    */
/*  icon geometry itself, never to a box behind it.                    */
/* ------------------------------------------------------------------ */

export const UserFilledIcon: IconComponent = () => (
  <svg {...iconProps}>
    {/* body / shoulders — warm yellow */}
    <path d="M3.2 13.2c0-3 2.15-5.4 4.8-5.4s4.8 2.4 4.8 5.4H3.2Z" fill="#f5b537" />
    {/* head — warm skin tone */}
    <circle cx="8" cy="5.6" r="2.3" fill="#f2b88f" />
  </svg>
)

export const BriefcaseFilledIcon: IconComponent = () => (
  <svg {...iconProps}>
    <rect x="2.3" y="5.6" width="11.4" height="7" rx="1.2" fill="#3b82f6" />
    <rect x="2.3" y="8.55" width="11.4" height="1.1" fill="#1d4ed8" opacity="0.85" />
    <path
      d="M6.2 5.6V4.3a1.8 1.8 0 0 1 1.8-1.8v0a1.8 1.8 0 0 1 1.8 1.8v1.3"
      stroke="#1e3a8a"
      strokeWidth="1.3"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
)

export const PaletteFilledIcon: IconComponent = () => (
  <svg {...iconProps}>
    <path
      d="M8 2.4a5.6 5.6 0 1 0 0 11.2c.8 0 1.3-.6 1.3-1.2 0-.27-.1-.5-.3-.7-.2-.2-.3-.45-.3-.7 0-.5.5-.9 1-.9h1.1A2.8 2.8 0 0 0 13.6 7c0-2.6-2.5-4.6-5.6-4.6Z"
      fill="#a855f7"
    />
    <circle cx="5.4" cy="7.2" r=".65" fill="#fdf4ff" />
    <circle cx="6.7" cy="5" r=".65" fill="#fdf4ff" />
    <circle cx="9.4" cy="5" r=".65" fill="#fdf4ff" />
    <circle cx="10.6" cy="7.2" r=".65" fill="#fdf4ff" />
  </svg>
)

export const CodeFilledIcon: IconComponent = () => (
  <svg {...iconProps}>
    <path
      d="M5.6 4.4 2 8l3.6 3.6M10.4 4.4 14 8l-3.6 3.6"
      stroke="#16a34a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const FinanceFilledIcon: IconComponent = () => (
  <svg {...iconProps}>
    <path
      d="M8 2.5v11M5.2 4.8h3.6a1.7 1.7 0 0 1 0 3.4H7.2a1.7 1.7 0 0 0 0 3.4h3.6"
      stroke="#e11d48"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/* ------------------------------------------------------------------ */
/*  public option type + default content                               */
/* ------------------------------------------------------------------ */

export interface ElasticDropdownOption {
  value: string
  label: string
  icon?: IconComponent
  filledIcon?: IconComponent
}

const DEFAULT_OPTIONS: ElasticDropdownOption[] = [
  { value: "personal", label: "Personal", icon: UserIcon, filledIcon: UserFilledIcon },
  { value: "work", label: "Work", icon: BriefcaseIcon, filledIcon: BriefcaseFilledIcon },
  { value: "design", label: "Design", icon: PaletteIcon, filledIcon: PaletteFilledIcon },
  { value: "development", label: "Development", icon: CodeIcon, filledIcon: CodeFilledIcon },
  { value: "finance", label: "Finance", icon: FinanceIcon, filledIcon: FinanceFilledIcon },
]

/* ------------------------------------------------------------------ */
/*  geometry                                                            */
/* ------------------------------------------------------------------ */

const CLOSED_HEIGHT = 52
const CLOSED_RADIUS = CLOSED_HEIGHT / 2
const OPEN_RADIUS = 18
const BOW_MAX = 9
const MIN_EXPANDED_HEIGHT = CLOSED_HEIGHT + 100
const SIDE_CURVE_MAX = 8

const SPRING_STIFFNESS = 210
const SPRING_DAMPING = 23

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** One continuous rounded silhouette — the path IS the visible surface.
 *  Each side is built from exactly TWO curve segments with a real path
 *  vertex at the vertical midpoint, rather than one long sampled wave:
 *
 *    top corner -> CURVE 1 (upper, bulges outward) -> midpoint vertex
 *    midpoint vertex -> CURVE 2 (lower, curves inward) -> bottom corner
 *
 *  Both segments are quadratic Béziers, so each curve is individually
 *  smooth with no jagged joints, while the midpoint is a genuine point
 *  on the path — giving a visible, structural transition between the
 *  two curves instead of one continuous blended arc. Left and right
 *  sides mirror the same two-segment shape. curveAmp is the resting
 *  "premium" curve amount (grows in as the dropdown opens); bow is the
 *  transient elastic overshoot, which pushes the whole side outward
 *  briefly during the spring animation on top of that resting shape.
 *  There is no rect/background element anywhere behind this — the
 *  fill of this path is the only visible surface of the dropdown. */
function buildShapePath(width: number, height: number, radius: number, bow: number, openT: number) {
  const w = Math.max(width, 1)
  const h = Math.max(height, 1)
  const r = Math.min(radius, h / 2, w / 2)
  const curveAmp = lerp(0, SIDE_CURVE_MAX, clamp(openT, 0, 1))

  const span = Math.max(h - 2 * r, 1)
  const midY = r + span / 2
  const upperMidY = r + span / 4
  const lowerMidY = r + (span * 3) / 4

  // Curve 1 (upper): bulges outward. Curve 2 (lower): curves inward.
  // The overshoot bow pushes curve 1 further out and briefly relaxes
  // curve 2's inward pull, as if the whole side is being stretched.
  const upperOut = Math.max(curveAmp + bow * 0.8, 0)
  const lowerIn = Math.max(curveAmp - bow * 0.5, 0)

  return (
    `M ${r} 0` +
    ` H ${w - r}` +
    ` A ${r} ${r} 0 0 1 ${w} ${r}` +
    // right side, top -> bottom
    ` Q ${w + upperOut} ${upperMidY} ${w} ${midY}` +
    ` Q ${w - lowerIn} ${lowerMidY} ${w} ${h - r}` +
    ` A ${r} ${r} 0 0 1 ${w - r} ${h}` +
    ` H ${r}` +
    ` A ${r} ${r} 0 0 1 0 ${h - r}` +
    // left side (mirrored), bottom -> top
    ` Q ${lowerIn} ${lowerMidY} 0 ${midY}` +
    ` Q ${-upperOut} ${upperMidY} 0 ${r}` +
    ` A ${r} ${r} 0 0 1 ${r} 0` +
    " Z"
  )
}

/* ------------------------------------------------------------------ */
/*  component                                                           */
/* ------------------------------------------------------------------ */

export interface ElasticDropdownProps {
  options?: ElasticDropdownOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  placeholderIcon?: IconComponent
  disabled?: boolean
  className?: string
}

export function ElasticDropdown({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue,
  onChange,
  placeholder = "Select option",
  placeholderIcon: PlaceholderIcon = FolderIcon,
  disabled = false,
  className,
}: ElasticDropdownProps) {
  const reactId = React.useId()
  const listboxId = `${reactId}-listbox`
  const optionId = (i: number) => `${reactId}-option-${i}`

  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(defaultValue)
  const currentValue = isControlled ? value : uncontrolledValue
  const selectedIndex = options.findIndex((o) => o.value === currentValue)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  const [open, setOpenState] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [isFocused, setIsFocused] = React.useState(false)

  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)
  const listRef = React.useRef<HTMLUListElement | null>(null)
  const optionsMeasureRef = React.useRef<HTMLDivElement | null>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)
  const pathRef = React.useRef<SVGPathElement | null>(null)
  const chevronRef = React.useRef<SVGSVGElement | null>(null)
  const optionsWrapRef = React.useRef<HTMLDivElement | null>(null)

  const posRef = React.useRef(0)
  const velRef = React.useRef(0)
  const targetRef = React.useRef(0)
  const rafRef = React.useRef<number | null>(null)
  const lastTimeRef = React.useRef<number | null>(null)
  const widthRef = React.useRef(240)
  const expandedHeightRef = React.useRef(MIN_EXPANDED_HEIGHT)
  const openRef = React.useRef(false)
  const reducedMotionRef = React.useRef(false)

  const applyFrame = React.useCallback((pos: number) => {
    const container = rootRef.current
    const svg = svgRef.current
    const path = pathRef.current
    const chevron = chevronRef.current
    const optionsWrap = optionsWrapRef.current
    if (!container || !svg || !path) return

    const width = widthRef.current
    const expandedHeight = expandedHeightRef.current
    const t = clamp(pos, 0, 1)

    const height = clamp(lerp(CLOSED_HEIGHT, expandedHeight, pos), CLOSED_HEIGHT - 4, expandedHeight + 16)
    const radius = lerp(CLOSED_RADIUS, OPEN_RADIUS, t)
    const excess = pos - t
    const bow = clamp(excess * 46, -BOW_MAX, BOW_MAX)

    container.style.height = `${height}px`
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
    svg.setAttribute("width", `${width}`)
    svg.setAttribute("height", `${height}`)
    path.setAttribute("d", buildShapePath(width, height, radius, bow, t))

    if (chevron) chevron.style.transform = `rotate(${t * 180}deg)`

    if (optionsWrap) {
      const reveal = clamp((t - 0.32) / 0.68, 0, 1)
      optionsWrap.style.opacity = `${reveal}`
      optionsWrap.style.transform = `translateY(${(1 - reveal) * 6}px)`
      optionsWrap.style.pointerEvents = t > 0.6 ? "auto" : "none"
    }
  }, [])

  const tick = React.useCallback(
    (now: number) => {
      const last = lastTimeRef.current ?? now
      const dt = Math.min((now - last) / 1000, 0.064)
      lastTimeRef.current = now

      const target = targetRef.current
      const force = (target - posRef.current) * SPRING_STIFFNESS - velRef.current * SPRING_DAMPING
      velRef.current += force * dt
      posRef.current += velRef.current * dt

      applyFrame(posRef.current)

      const atRest = Math.abs(target - posRef.current) < 0.001 && Math.abs(velRef.current) < 0.001
      if (!atRest) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        posRef.current = target
        velRef.current = 0
        applyFrame(target)
        rafRef.current = null
        lastTimeRef.current = null
        if (target === 0) setMounted(false)
      }
    },
    [applyFrame]
  )

  const runSpring = React.useCallback(
    (target: number) => {
      targetRef.current = target

      if (reducedMotionRef.current) {
        posRef.current = target
        velRef.current = 0
        applyFrame(target)
        if (target === 0) setMounted(false)
        return
      }

      if (rafRef.current == null) {
        lastTimeRef.current = null
        rafRef.current = requestAnimationFrame(tick)
      }
    },
    [applyFrame, tick]
  )

  const measure = React.useCallback(() => {
    if (rootRef.current) {
      widthRef.current = rootRef.current.getBoundingClientRect().width || widthRef.current
    }
    if (optionsMeasureRef.current) {
      const optionsHeight = optionsMeasureRef.current.scrollHeight
      expandedHeightRef.current = Math.max(CLOSED_HEIGHT + optionsHeight, MIN_EXPANDED_HEIGHT)
    }
  }, [])

  const close = React.useCallback(() => {
    setOpenState(false)
    openRef.current = false
    runSpring(0)
    if (rootRef.current?.contains(document.activeElement)) {
      buttonRef.current?.focus()
    }
  }, [runSpring])

  const openMenu = React.useCallback(() => {
    if (disabled) return
    setMounted(true)
    setOpenState(true)
    openRef.current = true
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    requestAnimationFrame(() => {
      measure()
      runSpring(1)
      listRef.current?.focus()
    })
  }, [disabled, measure, runSpring, selectedIndex])

  const toggle = React.useCallback(() => {
    if (disabled) return
    if (openRef.current) close()
    else openMenu()
  }, [close, disabled, openMenu])

  const selectOption = React.useCallback(
    (index: number) => {
      const option = options[index]
      if (!option) return
      if (!isControlled) setUncontrolledValue(option.value)
      onChange?.(option.value)
      close()
    },
    [close, isControlled, onChange, options]
  )

  React.useEffect(() => {
    const linkId = "elastic-dropdown-manrope-font"
    if (!document.getElementById(linkId)) {
      const preconnect1 = document.createElement("link")
      preconnect1.rel = "preconnect"
      preconnect1.href = "https://fonts.googleapis.com"
      document.head.appendChild(preconnect1)

      const preconnect2 = document.createElement("link")
      preconnect2.rel = "preconnect"
      preconnect2.href = "https://fonts.gstatic.com"
      preconnect2.crossOrigin = "anonymous"
      document.head.appendChild(preconnect2)

      const link = document.createElement("link")
      link.id = linkId
      link.rel = "stylesheet"
      link.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&display=swap"
      document.head.appendChild(link)
    }
  }, [])

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = mq.matches
    const handler = () => {
      reducedMotionRef.current = mq.matches
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  React.useLayoutEffect(() => {
    measure()
    applyFrame(posRef.current)
    const onResize = () => {
      measure()
      if (rafRef.current == null) applyFrame(posRef.current)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [measure, applyFrame])

  React.useEffect(() => {
    if (mounted) measure()
  }, [mounted, measure])

  React.useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [open, close])

  React.useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (open) return
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault()
      openMenu()
    }
  }

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, options.length - 1))
        break
      case "ArrowUp":
        event.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case "Home":
        event.preventDefault()
        setActiveIndex(0)
        break
      case "End":
        event.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case "Enter":
      case " ":
        event.preventDefault()
        selectOption(activeIndex)
        break
      case "Escape":
        event.preventDefault()
        close()
        break
      case "Tab":
        close()
        break
      default:
        break
    }
  }

  const TriggerOutlineIcon = PlaceholderIcon
  const TriggerFilledIcon = selected?.filledIcon
  const triggerLabel = selected ? selected.label : placeholder

  return (
    <div
      className={["elastic-dropdown-root", className].filter(Boolean).join(" ")}
      style={{ width: "min(100%, 260px)" }}
    >
      <style>{`
        .elastic-dropdown-root {
          font-family: "Manrope", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          --edd-surface: #ffffff;
          --edd-border: rgba(15, 23, 42, 0.10);
          --edd-text: #0f172a;
          --edd-text-muted: #64748b;
          --edd-highlight: rgba(15, 23, 42, 0.045);
          --edd-highlight-strong: rgba(37, 99, 235, 0.10);
          --edd-focus: #2563eb;
          --edd-shadow-1: 0 1px 2px rgba(15, 23, 42, 0.05);
          --edd-shadow-2: 0 10px 24px rgba(15, 23, 42, 0.08);
        }
        @media (prefers-color-scheme: dark) {
          .elastic-dropdown-root {
            --edd-surface: #17191f;
            --edd-border: rgba(255, 255, 255, 0.12);
            --edd-text: #f1f5f9;
            --edd-text-muted: #94a3b8;
            --edd-highlight: rgba(255, 255, 255, 0.06);
            --edd-highlight-strong: rgba(96, 165, 250, 0.16);
            --edd-focus: #60a5fa;
            --edd-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.35);
            --edd-shadow-2: 0 14px 28px rgba(0, 0, 0, 0.45);
          }
        }
        .dark .elastic-dropdown-root {
          --edd-surface: #17191f;
          --edd-border: rgba(255, 255, 255, 0.12);
          --edd-text: #f1f5f9;
          --edd-text-muted: #94a3b8;
          --edd-highlight: rgba(255, 255, 255, 0.06);
          --edd-highlight-strong: rgba(96, 165, 250, 0.16);
          --edd-focus: #60a5fa;
          --edd-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.35);
          --edd-shadow-2: 0 14px 28px rgba(0, 0, 0, 0.45);
        }
        .edd-container {
          position: relative;
          width: 100%;
          overflow: visible;
          background: transparent;
          border-radius: 26px;
          transition: box-shadow 200ms ease, transform 200ms ease;
        }
        .edd-container.is-hover-ready:hover {
          transform: translateY(-1px);
        }
        .edd-container.is-disabled {
          opacity: 0.5;
        }
        .edd-shape {
          position: absolute;
          inset: 0;
          display: block;
          overflow: visible;
          background: transparent;
          pointer-events: none;
          filter: drop-shadow(var(--edd-shadow-1)) drop-shadow(var(--edd-shadow-2));
        }
        .edd-shape path {
          fill: var(--edd-surface);
          stroke: var(--edd-border);
          stroke-width: 1px;
        }
        .edd-content {
          position: relative;
          z-index: 1;
          height: 100%;
          overflow: hidden;
        }
        .edd-trigger {
          all: unset;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          height: ${CLOSED_HEIGHT}px;
          padding: 0 18px;
          cursor: pointer;
          color: var(--edd-text);
        }
        .edd-trigger:disabled {
          cursor: not-allowed;
        }
        .edd-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          background: transparent;
          border: none;
          outline: none;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
          color: var(--edd-text);
        }
        .edd-icon.is-placeholder {
          color: var(--edd-text-muted);
        }
        .edd-value {
          flex: 1;
          min-width: 0;
          text-align: left;
          font-size: 14.5px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .edd-value.is-placeholder {
          color: var(--edd-text-muted);
        }
        .edd-chevron {
          flex-shrink: 0;
          color: var(--edd-text-muted);
          transition: color 150ms ease;
        }
        .edd-options-wrap {
          padding: 4px 8px 10px;
          opacity: 0;
          will-change: opacity, transform;
        }
        .edd-list {
          all: unset;
          display: block;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .edd-option {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          margin: 0 2px;
          border-radius: 12px;
          font-size: 14px;
          color: var(--edd-text);
          cursor: pointer;
          background: transparent;
          transition: background-color 120ms ease;
        }
        .edd-option.is-active {
          background: var(--edd-highlight);
        }
        .edd-option.is-selected {
          background: var(--edd-highlight-strong);
        }
        .edd-option.is-selected .edd-icon {
          color: var(--edd-text);
        }
        .edd-options-measure {
          position: absolute;
          visibility: hidden;
          pointer-events: none;
          top: 0;
          left: 0;
          width: 100%;
          z-index: -1;
        }

        /* ---- per-option icon: true front/back 3D card-flip ---- */
        /* .edd-icon-flip is a pure alignment box — no background, no
           border, no shadow, no radius. Nothing renders here except
           the icon geometry itself, so there is never a square/tile
           behind it, on hover or otherwise. It only carries perspective
           so the faces inside it visibly foreshorten as they turn. */
        .edd-icon-flip {
          position: relative;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          background: none;
          border: none;
          box-shadow: none;
          border-radius: 0;
          padding: 0;
          perspective: 480px;
          pointer-events: none;
          transition: width 320ms cubic-bezier(0.22, 1, 0.36, 1),
            height 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .edd-option.is-active .edd-icon-flip {
          width: 21px;
          height: 21px;
        }
        .edd-icon-flip-inner {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform-origin: 50% 50%;
          transform: rotateY(0deg);
          transition: transform 620ms cubic-bezier(0.65, 0, 0.35, 1);
        }
        /* Selecting/hovering an option spins the icon a full turn:
           0° front (outline) -> 90° edge-on (thin, true perspective
           foreshortening, no content visible) -> 180° the physical
           BACK face (pre-mirrored, colored) rotates into view facing
           the viewer -> 270° edge-on again -> 360° front face is back
           in its resting orientation, but we hand off to the colored
           face exactly at 180 (see .is-selected rule below) so the
           icon settles on the colorful version instead of spinning
           past it back to the outline. */
        .edd-option.is-active .edd-icon-flip-inner {
          transform: rotateY(180deg);
        }
        .edd-icon-face {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          box-shadow: none;
          pointer-events: none;
          /* backface-visibility is what makes this an actual 3D object
             instead of a flat crossfade: each face only renders while
             it is turned toward the viewer, so the icon genuinely goes
             edge-on and disappears at 90°/270° instead of fading. */
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .edd-icon-face svg {
          width: 100%;
          height: 100%;
        }
        .edd-icon-face.front {
          color: var(--edd-text-muted);
          transform: rotateY(0deg);
        }
        .edd-icon-face.back {
          /* pre-rotated 180° so that once the parent has turned 180°,
             this face lands facing forward, right-reading rather than
             mirrored — the same trick a real flipped card relies on. */
          transform: rotateY(180deg);
        }
        .edd-option.is-selected .edd-icon-flip-inner {
          transform: rotateY(180deg);
        }

        /* ---- per-option label: subtle scale + weight on hover ---- */
        .edd-option-label {
          display: inline-block;
          transform-origin: left center;
          transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), font-weight 200ms ease;
          font-weight: 500;
        }
        .edd-option.is-active .edd-option-label {
          transform: scale(1.06);
          font-weight: 600;
        }
        .edd-option.is-selected .edd-option-label {
          font-weight: 600;
        }

        @media (prefers-reduced-motion: reduce) {
          .edd-container,
          .edd-container.is-hover-ready:hover {
            transition: box-shadow 120ms ease;
            transform: none;
          }
          .edd-icon-flip,
          .edd-icon-flip-inner,
          .edd-option-label {
            transition: none !important;
          }
          .edd-option.is-active .edd-icon-flip {
            width: 16px;
            height: 16px;
          }
          .edd-option.is-active .edd-icon-flip-inner,
          .edd-option.is-selected .edd-icon-flip-inner {
            transform: rotateY(180deg);
          }
          .edd-option.is-active .edd-option-label {
            transform: none;
          }
        }
      `}</style>

      <div
        ref={rootRef}
        className={`edd-container is-hover-ready${isFocused ? " is-focused" : ""}${disabled ? " is-disabled" : ""}`}
        style={{ height: CLOSED_HEIGHT }}
      >
        <svg ref={svgRef} className="edd-shape" aria-hidden="true">
          <path ref={pathRef} />
        </svg>

        <div className="edd-content">
          <button
            ref={buttonRef}
            type="button"
            className="edd-trigger"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            onClick={toggle}
            onKeyDown={handleButtonKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <span className={`edd-icon${selected ? "" : " is-placeholder"}`}>
              {selected && TriggerFilledIcon ? <TriggerFilledIcon /> : <TriggerOutlineIcon />}
            </span>
            <span className={`edd-value${selected ? "" : " is-placeholder"}`}>{triggerLabel}</span>
            <svg
              ref={chevronRef}
              className="edd-chevron"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              style={{ transformOrigin: "50% 50%" }}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {mounted && (
            <div ref={optionsWrapRef} className="edd-options-wrap">
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                tabIndex={-1}
                aria-activedescendant={optionId(activeIndex)}
                className="edd-list"
                onKeyDown={handleListKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onMouseLeave={() => setActiveIndex(selectedIndex >= 0 ? selectedIndex : -1)}
              >
                {options.map((option, index) => {
                  const OutlineIcon = option.icon
                  const FilledIcon = option.filledIcon
                  return (
                    <li
                      key={option.value}
                      id={optionId(index)}
                      role="option"
                      aria-selected={selectedIndex === index}
                      className={`edd-option${activeIndex === index ? " is-active" : ""}${
                        selectedIndex === index ? " is-selected" : ""
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onPointerDown={() => setActiveIndex(index)}
                      onClick={() => selectOption(index)}
                    >
                      {OutlineIcon && (
                        <span className="edd-icon-flip">
                          <span className="edd-icon-flip-inner">
                            <span className="edd-icon-face front">
                              <OutlineIcon />
                            </span>
                            {FilledIcon && (
                              <span className="edd-icon-face back">
                                <FilledIcon />
                              </span>
                            )}
                          </span>
                        </span>
                      )}
                      <span className="edd-option-label">{option.label}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <div ref={optionsMeasureRef} className="edd-options-measure" aria-hidden="true">
          <div className="edd-options-wrap" style={{ opacity: 1 }}>
            <ul className="edd-list">
              {options.map((option) => {
                const OptionIcon = option.icon
                return (
                  <li key={option.value} className="edd-option">
                    {OptionIcon && (
                      <span className="edd-icon">
                        <OptionIcon />
                      </span>
                    )}
                    <span>{option.label}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  demo shell                                                          */
/* ------------------------------------------------------------------ */

export default function ElasticDropdownShowcase() {
  const [isDark, setIsDark] = React.useState(false)

  return (
    <div
      className={isDark ? "dark" : undefined}
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        minHeight: 420,
        alignItems: "start",
        justifyContent: "center",
        overflow: "hidden",
        padding: 24,
        borderRadius: 24,
        background: isDark ? "#0a0a12" : "#f8f7fc",
        transition: "background 400ms ease",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: "9999px",
          opacity: 0.3,
          filter: "blur(60px)",
          background: isDark
            ? "radial-gradient(circle, #4c1d95, transparent 70%)"
            : "radial-gradient(circle, #c4b5fd, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -80,
          left: -60,
          width: 260,
          height: 260,
          borderRadius: "9999px",
          opacity: 0.3,
          filter: "blur(60px)",
          background: isDark
            ? "radial-gradient(circle, #1e3a8a, transparent 70%)"
            : "radial-gradient(circle, #bfdbfe, transparent 70%)",
        }}
      />

      <button
        type="button"
        onClick={() => setIsDark((d) => !d)}
        aria-label="Toggle color theme"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 20,
          display: "flex",
          height: 36,
          width: 36,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
          border: "none",
          cursor: "pointer",
          color: isDark ? "#fff" : "#334155",
          background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          {isDark ? (
            <path
              d="M8 2v1.4M8 12.6V14M14 8h-1.4M3.4 8H2M12 4l-1 1M5 11l-1 1M12 12l-1-1M5 5 4 4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          )}
          {isDark && <circle cx="8" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.4" />}
        </svg>
      </button>

      <div style={{ position: "relative", zIndex: 10 }}>
        <ElasticDropdown placeholder="Project" />
      </div>
    </div>
  )
}
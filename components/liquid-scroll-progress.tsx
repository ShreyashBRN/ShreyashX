"use client"

import * as React from "react"

type LiquidScrollProgressSection = {
  title: string
}

type LiquidScrollProgressProps = {
  sections?: LiquidScrollProgressSection[]
  liquidColor?: string
  className?: string
}

const DEFAULT_SECTIONS: LiquidScrollProgressSection[] = [
  { title: "Introduction" },
  { title: "Implementation" },
  { title: "Customization" },
  { title: "Usage" },
]

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max)

/* ------------------------------------------------------------------ */
/*  Geometry — single source of truth (px), recalculated for the mini  */
/*  footprint rather than scaled visually. The connector is a          */
/*  transparent track that tucks fully behind the pipe on the left     */
/*  and fully behind the card on the right (lower z-index on both) —   */
/*  the overlap hides the seam on both joints, and its liquid fill     */
/*  (not the track) is what makes the connection visible.              */
/* ------------------------------------------------------------------ */

const PIPE_LEFT = 4
const PIPE_W = 6
const GAP = 22 // sidebar gutter: pipe → card
const TUCK_INTO_CARD = 4 // how far the branch reaches under the card's edge

export function LiquidScrollProgress({
  sections = DEFAULT_SECTIONS,
  liquidColor = "#159cff",
  className = "",
}: LiquidScrollProgressProps) {
  const pipeLiquidRef = React.useRef<HTMLDivElement | null>(null)
  const connectorLiquidRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const cardLiquidRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const contentRefs = React.useRef<Array<HTMLDivElement | null>>([])

  connectorLiquidRefs.current = []
  cardLiquidRefs.current = []
  contentRefs.current = []

  React.useEffect(() => {
    if (sections.length === 0) return

    let frame = 0
    const total = sections.length

    const update = () => {
      if (frame) cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        const doc = document.documentElement
        const scrollable = doc.scrollHeight - window.innerHeight
        const overall = scrollable > 0 ? clamp(window.scrollY / scrollable) : 0

        // Direct DOM writes, no React state — nothing re-renders on scroll,
        // nothing fights a CSS transition, so the liquid stays glued to
        // the scrollbar instead of trailing behind it.
        if (pipeLiquidRef.current) {
          pipeLiquidRef.current.style.transform = `scaleY(${overall})`
        }

        for (let i = 0; i < total; i++) {
          const start = i / total
          const end = (i + 1) / total
          const raw = clamp((overall - start) / (end - start))
          // The connector races ahead of the card: it's the liquid in
          // transit from the vertical pipe, so it fills over the first
          // slice of the section's progress, then hands off to the card.
          const connectorFill = clamp(raw / 0.35)
          const cardFill = clamp((raw - 0.1) / 0.9)
          const isFilled = cardFill >= 0.45

          const connectorEl = connectorLiquidRefs.current[i]
          if (connectorEl) connectorEl.style.transform = `scaleX(${connectorFill})`

          const cardEl = cardLiquidRefs.current[i]
          if (cardEl) cardEl.style.transform = `scaleY(${cardFill})`

          const contentEl = contentRefs.current[i]
          if (contentEl) contentEl.classList.toggle("is-filled", isFilled)
        }
      })
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [sections.length])

  if (sections.length === 0) return null

  return (
    <section
      aria-label="Scroll progress"
      className={`relative mx-auto w-full max-w-xs px-2 py-4 sm:px-3 ${className}`}
    >
      {/* Component-local styles: keyframes + the filled-state crossfade.
          The crossfade is a plain CSS transition triggered by toggling
          .is-filled via ref, so it animates smoothly without React
          re-rendering on every scroll frame. */}
      <style>{`
        .lsp-glass {
          border: 1px solid rgba(148,163,184,0.35);
          /* Shared pipe casing: the main vertical pipe and empty
             connector track use this exact same visual treatment. */
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(8px);
          box-shadow:
            inset 1px 0 1px rgba(255,255,255,0.9),
            inset -1px 0 1px rgba(15,23,42,0.08),
            0 1px 3px rgba(15,23,42,0.08);
        }
        .lsp-liquid-h {
          /* Same water as the vertical pipe/card, just re-oriented to
             flow left-to-right so it reads as coming out of the pipe. */
          background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--lsp-color) 68%, white 32%) 0%,
            color-mix(in srgb, var(--lsp-color) 58%, white 42%) 65%,
            rgba(255,255,255,0.7) 100%
          );
          box-shadow:
            0 0 4px color-mix(in srgb, var(--lsp-color) 35%, transparent),
            inset 0 1px 1px rgba(255,255,255,0.5);
        }
        .lsp-liquid {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.65) 0%,
            color-mix(in srgb, var(--lsp-color) 50%, white 50%) 22%,
            color-mix(in srgb, var(--lsp-color) 68%, white 32%) 100%
          );
          box-shadow:
            0 0 5px color-mix(in srgb, var(--lsp-color) 35%, transparent),
            inset 1px 0 1px rgba(255,255,255,0.6);
        }
        .lsp-content { color: #0f172a; transition: color 300ms ease; }
        .lsp-content.is-filled { color: #fff; }
        .lsp-title {
          font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-weight: 500;
          letter-spacing: 0.06em;
          line-height: 1;
        }
        @keyframes liquid-scroll-bubble-mini {
          0%   { transform: translate3d(0, 3px, 0) scale(0.7); opacity: 0; }
          15%  { opacity: 0.7; }
          70%  { opacity: 0.45; }
          100% { transform: translate3d(var(--bubble-drift, 0px), -34px, 0) scale(1); opacity: 0; }
        }
        @keyframes liquid-scroll-wave {
          0%, 100% { transform: translateX(-2%) scaleX(1); }
          50%      { transform: translateX(2%) scaleX(1.03); }
        }
        @keyframes liquid-scroll-shimmer {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .liquid-scroll-motion { animation: none !important; }
        }
      `}</style>

      {/* Sidebar layout: fixed gutter on the left for the pipe, cards right */}
      <div
        className="relative w-full"
        style={{ paddingLeft: GAP, "--lsp-color": liquidColor } as React.CSSProperties}
      >
        {/* ============================================================
            MAIN VERTICAL PIPE — open at both ends (no caps), always on
            top (z-20) so connectors can tuck invisibly behind it. It is
            absolutely positioned with top-0/bottom-0 against this same
            wrapper that the card column lays out in-flow inside, so its
            top and bottom track the card group's actual top and bottom
            edges exactly — no hardcoded height, no independent margin,
            and it stays correct if card height/spacing ever changes.
            Its casing is opaque-frosted (see .lsp-glass) so the
            connector's liquid, once it scales in behind it, joins
            seamlessly rather than showing a seam at the joint.
        ============================================================ */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 top-0 z-20"
          style={{ left: PIPE_LEFT, width: PIPE_W }}
        >
          <div className="lsp-glass absolute inset-0 rounded-full" />

          <div className="absolute inset-[1.5px] overflow-hidden rounded-full">
            <div
              ref={pipeLiquidRef}
              className="lsp-liquid absolute inset-0 origin-top will-change-transform"
              style={{ transform: "scaleY(0)" }}
            >
              <LiquidBubbles compact />
              <div className="liquid-scroll-motion absolute -left-full top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-[1px] motion-safe:animate-[liquid-scroll-shimmer_2.8s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>

        {/* ============================================================
            CONTENT SECTIONS
        ============================================================ */}
        <div className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <article key={section.title} className="relative w-full">
              {/* ====================================================
                  HORIZONTAL CONNECTOR — a fixed-position track, fully
                  tucked behind the pipe on the left (z-5 < pipe's z-20)
                  and fully behind the card on the right (z-5 < card's
                  z-20), so both joints stay seamless. Two stacked
                  layers: an always-visible neutral "empty tube"
                  (the same .lsp-glass pipe casing used by the main vertical pipe,
                  tuned for both light and dark backgrounds) underneath,
                  and the liquid fill on top
                  that scales in from the left as this section's scroll
                  progress advances — so the connector is never fully
                  invisible, and the liquid stays visually distinct
                  from the empty track underneath it.
              ==================================================== */}
              <div
                className="absolute top-1/2 z-[5] h-[7px] -translate-y-1/2 overflow-hidden rounded-full"
                style={{
                  left: -(GAP - PIPE_LEFT),
                  width: GAP - PIPE_LEFT + TUCK_INTO_CARD,
                }}
              >
                <div aria-hidden="true" className="lsp-glass absolute inset-0 rounded-full" />
                <div
                  ref={(node) => {
                    connectorLiquidRefs.current[index] = node
                  }}
                  aria-hidden="true"
                  className="lsp-liquid-h absolute inset-y-0 left-0 w-full origin-left will-change-transform"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>

              {/* ====================================================
                  CONTENT CARD (tank) — z-20, painted above the
                  branch so its left edge hides the tuck. Left-anchored
                  (not centered) with a fixed width and height (not
                  content-based) so every box in the list is identical,
                  regardless of title length, while the connector still
                  meets its left edge exactly as before.
              ==================================================== */}
              <div className="relative z-20 w-[180px] max-w-full h-[48px] overflow-hidden rounded-none border border-slate-300/40 bg-white/[0.7] shadow-[0_4px_10px_rgba(20,40,60,0.08),inset_0_1px_rgba(255,255,255,0.9)] backdrop-blur-xl">
                {/* Liquid tank */}
                <div
                  ref={(node) => {
                    cardLiquidRefs.current[index] = node
                  }}
                  aria-hidden="true"
                  className="lsp-liquid absolute inset-x-0 bottom-0 top-0 origin-bottom overflow-hidden will-change-transform"
                  style={{ transform: "scaleY(0)" }}
                >
                  {/* Depth gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-sky-200/40 via-transparent to-sky-400/20" />

                  {/* Water surface */}
                  <div className="liquid-scroll-motion absolute -left-[5%] -top-[2px] h-1.5 w-[110%] rounded-[50%] bg-white/35 blur-[1px] motion-safe:animate-[liquid-scroll-wave_2.8s_ease-in-out_infinite]" />

                  {/* Surface glow */}
                  <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/15 to-transparent" />

                  <LiquidBubbles />

                  {/* Moving shimmer */}
                  <div className="liquid-scroll-motion absolute -left-full top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm motion-safe:animate-[liquid-scroll-shimmer_3.5s_ease-in-out_infinite]" />
                </div>

                {/* Glass overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-none border border-white/60 shadow-[inset_0_1px_rgba(255,255,255,0.85),inset_0_-1px_rgba(15,23,42,0.04)]"
                />

                {/* Card content — centered both axes */}
                <div
                  ref={(node) => {
                    contentRefs.current[index] = node
                  }}
                  className="lsp-content relative z-10 flex h-full w-full items-center justify-center px-3 text-center"
                >
                  <span className="lsp-title truncate uppercase text-[14px] font-medium">
                    {section.title}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Bubbles                                                            */
/* ------------------------------------------------------------------ */

function LiquidBubbles({ compact = false }: { compact?: boolean }) {
  const bubbles = compact
    ? [
        { left: "35%", size: 1, duration: "2.4s", delay: "0s", drift: "-1px" },
        { left: "65%", size: 1, duration: "3s", delay: "0.6s", drift: "1px" },
      ]
    : [
        { left: "20%", size: 1.5, duration: "2.6s", delay: "0s", drift: "-1px" },
        { left: "50%", size: 2, duration: "3.2s", delay: "0.7s", drift: "1px" },
        { left: "78%", size: 1.5, duration: "2.9s", delay: "1.3s", drift: "-1px" },
      ]

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {bubbles.map((bubble, index) => (
        <span
          key={index}
          className="liquid-scroll-motion absolute bottom-0 rounded-full bg-white/60 shadow-[0_0_3px_rgba(255,255,255,0.65)]"
          style={
            {
              left: bubble.left,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              "--bubble-drift": bubble.drift,
              animation: `liquid-scroll-bubble-mini ${bubble.duration} ease-in ${bubble.delay} infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
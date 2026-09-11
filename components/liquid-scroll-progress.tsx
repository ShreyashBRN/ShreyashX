"use client"

import * as React from "react"

type LiquidScrollProgressSection = {
  number: string
  title: string
  description: string
  icon?: React.ReactNode
}

type LiquidScrollProgressProps = {
  sections?: LiquidScrollProgressSection[]
  liquidColor?: string
  className?: string
}

const DEFAULT_SECTIONS: LiquidScrollProgressSection[] = [
  {
    number: "01",
    title: "Build Better Interfaces",
    description:
      "Beautiful, accessible, and customizable components to speed up your development.",
    icon: "✦",
  },
  {
    number: "02",
    title: "Designed for Developers",
    description:
      "Copy, customize, and ship. Fully open source and built with modern tools.",
    icon: "</>",
  },
  {
    number: "03",
    title: "Works With Your Stack",
    description:
      "Built with modern tools and designed to fit naturally into your existing projects.",
    icon: "◈",
  },
  {
    number: "04",
    title: "Open Source",
    description:
      "Free to use, modify, and contribute. Let's build a better web together.",
    icon: "♡",
  },
]

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max)

/* ------------------------------------------------------------------ */
/*  Geometry — single source of truth (px)                             */
/*                                                                     */
/*  The branch is one continuous OPAQUE strip that tucks fully behind  */
/*  the pipe on the left and fully behind the card on the right (lower */
/*  z-index on both). The overlap itself hides the seam — that's the   */
/*  only way to get a truly seamless joint on both ends. To stop it    */
/*  from ghosting through as a dark smudge, the pipe's own casing is   */
/*  opaque enough that nothing behind it is visible (see .lsp-glass).  */
/* ------------------------------------------------------------------ */

const PIPE_LEFT = 8
const PIPE_W = 12
const GAP = 56 // sidebar gutter: pipe → card
const TUCK_INTO_CARD = 10 // how far the branch reaches under the card's edge

export function LiquidScrollProgress({
  sections = DEFAULT_SECTIONS,
  liquidColor = "#159cff",
  className = "",
}: LiquidScrollProgressProps) {
  const pipeLiquidRef = React.useRef<HTMLDivElement | null>(null)
  const cardLiquidRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const contentRefs = React.useRef<Array<HTMLDivElement | null>>([])

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
          const cardFill = clamp((raw - 0.1) / 0.9)
          const isFilled = cardFill >= 0.45

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
      className={`relative mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 ${className}`}
    >
      {/* Component-local styles: keyframes + the filled-state crossfade.
          The crossfade is a plain CSS transition triggered by toggling
          .is-filled via ref, so it animates smoothly without React
          re-rendering on every scroll frame. */}
      <style>{`
        .lsp-glass {
          border: 1px solid rgba(148,163,184,0.35);
          /* Opaque enough that nothing behind it (the connector) can
             ghost through, while keeping a soft frosted look. This is
             what actually fixes the dark smudge — not the geometry. */
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          box-shadow:
            inset 1px 0 2px rgba(255,255,255,0.9),
            inset -1px 0 2px rgba(15,23,42,0.08),
            0 1px 4px rgba(15,23,42,0.08);
        }
        .lsp-pipe-connector {
          background: linear-gradient(180deg, #334155 0%, #1e293b 55%, #0f172a 100%);
          box-shadow:
            inset 0 1px 1px rgba(255,255,255,0.15),
            inset 0 -1px 2px rgba(0,0,0,0.45);
          border: 1px solid rgba(15,23,42,0.6);
        }
        .lsp-liquid {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.65) 0%,
            color-mix(in srgb, var(--lsp-color) 50%, white 50%) 22%,
            color-mix(in srgb, var(--lsp-color) 68%, white 32%) 100%
          );
          box-shadow:
            0 0 8px color-mix(in srgb, var(--lsp-color) 35%, transparent),
            inset 1px 0 2px rgba(255,255,255,0.6);
        }
        .lsp-content { color: #0f172a; transition: color 300ms ease; }
        .lsp-content.is-filled { color: #fff; }
        .lsp-num { color: #64748b; transition: color 300ms ease; }
        .lsp-content.is-filled .lsp-num { color: rgba(255,255,255,0.75); }
        .lsp-desc { color: #64748b; transition: color 300ms ease; }
        .lsp-content.is-filled .lsp-desc { color: rgba(255,255,255,0.85); }
        .lsp-icon {
          border-color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.4);
          color: #2563eb;
          transition: border-color 300ms ease, background-color 300ms ease, color 300ms ease;
        }
        .lsp-content.is-filled .lsp-icon {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        @keyframes liquid-scroll-bubble {
          0%   { transform: translate3d(0, 6px, 0) scale(0.7); opacity: 0; }
          15%  { opacity: 0.7; }
          70%  { opacity: 0.45; }
          100% { transform: translate3d(var(--bubble-drift, 0px), -90px, 0) scale(1); opacity: 0; }
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
            MAIN VERTICAL PIPE — always on top (z-20) so branches can
            tuck invisibly behind it. Its casing is now opaque-frosted
            (see .lsp-glass) so the connector hidden behind it never
            shows through, no matter how dark the connector is.
        ============================================================ */}
        <div
          aria-hidden="true"
          className="absolute bottom-3 top-3 z-20"
          style={{ left: PIPE_LEFT, width: PIPE_W }}
        >
          <div className="lsp-glass absolute inset-0 rounded-full" />

          <div className="absolute inset-[3px] overflow-hidden rounded-full">
            <div
              ref={pipeLiquidRef}
              className="lsp-liquid absolute inset-0 origin-top will-change-transform"
              style={{ transform: "scaleY(0)" }}
            >
              <LiquidBubbles compact />
              <div className="liquid-scroll-motion absolute -left-full top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-[2px] motion-safe:animate-[liquid-scroll-shimmer_2.8s_ease-in-out_infinite]" />
            </div>
          </div>

          {/* Top cap / valve knob */}
          <div className="absolute -left-[9px] -top-[8px] z-30 h-[16px] w-[30px] rounded-[6px] border border-slate-700/90 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-[0_3px_8px_rgba(0,0,0,0.25),inset_0_1px_rgba(255,255,255,0.15)]">
            <div className="absolute bottom-[3px] left-[5px] right-[5px] h-[2px] rounded-full bg-black/70" />
          </div>

          {/* Bottom cap */}
          <div className="absolute -bottom-[5px] -left-[6px] z-30 h-[11px] w-[24px] rounded-b-[6px] border border-slate-700/90 bg-gradient-to-b from-slate-700 to-slate-950 shadow-[0_3px_6px_rgba(0,0,0,0.25),inset_0_1px_rgba(255,255,255,0.12)]" />
        </div>

        {/* ============================================================
            CONTENT SECTIONS
        ============================================================ */}
        <div className="flex flex-col gap-10 sm:gap-12">
          {sections.map((section, index) => (
            <article
              key={`${section.number}-${section.title}`}
              className="relative min-h-[132px] w-full sm:min-h-[144px]"
            >
              {/* ====================================================
                  HORIZONTAL BRANCH — one opaque strip, fully tucked
                  behind the pipe on the left (z-5 < pipe's z-20) and
                  fully behind the card on the right (z-5 < card's
                  z-20). Same full-overlap geometry as the original
                  design — that's what makes both joints seamless.
                  No liquid lives inside it; it's a fixed, static
                  piece of plumbing regardless of scroll position.
              ==================================================== */}
              <div
                aria-hidden="true"
                className="lsp-pipe-connector absolute top-1/2 z-[5] h-[14px] -translate-y-1/2 rounded-full"
                style={{
                  left: -(GAP - PIPE_LEFT),
                  width: GAP - PIPE_LEFT + TUCK_INTO_CARD,
                }}
              />

              {/* ====================================================
                  CONTENT CARD (tank) — z-20, painted above the
                  branch so its rounded left edge hides the tuck.
              ==================================================== */}
              <div className="relative z-20 min-h-[132px] overflow-hidden rounded-2xl border border-slate-300/40 bg-white/[0.7] shadow-[0_10px_28px_rgba(20,40,60,0.08),inset_0_1px_rgba(255,255,255,0.9)] backdrop-blur-xl sm:min-h-[144px]">
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
                  <div className="liquid-scroll-motion absolute -left-[5%] -top-[5px] h-3 w-[110%] rounded-[50%] bg-white/35 blur-[2px] motion-safe:animate-[liquid-scroll-wave_2.8s_ease-in-out_infinite]" />

                  {/* Surface glow */}
                  <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/15 to-transparent" />

                  <LiquidBubbles />

                  {/* Moving shimmer */}
                  <div className="liquid-scroll-motion absolute -left-full top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md motion-safe:animate-[liquid-scroll-shimmer_3.5s_ease-in-out_infinite]" />
                </div>

                {/* Glass overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl border border-white/60 shadow-[inset_0_1px_rgba(255,255,255,0.85),inset_0_-1px_rgba(15,23,42,0.04)]"
                />

                {/* Card content */}
                <div
                  ref={(node) => {
                    contentRefs.current[index] = node
                  }}
                  className="lsp-content relative z-10 grid min-h-[132px] grid-cols-[32px_minmax(0,1fr)_44px] items-center gap-3 px-4 py-5 sm:min-h-[144px] sm:grid-cols-[36px_minmax(0,1fr)_48px] sm:px-5"
                >
                  <div className="lsp-num self-start pt-1 text-[11px] font-semibold tracking-wide sm:text-xs">
                    {section.number}
                  </div>

                  <div className="min-w-0">
                    <h2 className="mb-1.5 text-base font-semibold tracking-[-0.02em] sm:text-lg">
                      {section.title}
                    </h2>
                    <p className="lsp-desc max-w-lg text-[13px] leading-relaxed sm:text-sm">
                      {section.description}
                    </p>
                  </div>

                  {section.icon && (
                    <div className="lsp-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm sm:h-10 sm:w-10">
                      {section.icon}
                    </div>
                  )}
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
        { left: "30%", size: 2, duration: "2.4s", delay: "0s", drift: "-1px" },
        { left: "55%", size: 2, duration: "3s", delay: "0.6s", drift: "1px" },
        { left: "75%", size: 2, duration: "2.7s", delay: "1.2s", drift: "-1px" },
      ]
    : [
        { left: "14%", size: 3, duration: "2.6s", delay: "0s", drift: "-2px" },
        { left: "29%", size: 4, duration: "3.2s", delay: "0.7s", drift: "2px" },
        { left: "48%", size: 3, duration: "2.9s", delay: "1.3s", drift: "-1px" },
        { left: "67%", size: 4, duration: "3.4s", delay: "0.35s", drift: "3px" },
        { left: "82%", size: 3, duration: "2.8s", delay: "1.8s", drift: "-2px" },
      ]

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {bubbles.map((bubble, index) => (
        <span
          key={index}
          className="liquid-scroll-motion absolute bottom-0 rounded-full bg-white/60 shadow-[0_0_4px_rgba(255,255,255,0.65)]"
          style={
            {
              left: bubble.left,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              "--bubble-drift": bubble.drift,
              animation: `liquid-scroll-bubble ${bubble.duration} ease-in ${bubble.delay} infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
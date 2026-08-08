"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { frame, cancelFrame } from "framer-motion";

function LenisFrameSync() {
  const lenis = useLenis();

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenis?.raf(data.timestamp);
    }

    // Drives Lenis from Framer Motion's own frame loop instead of a separate
    // requestAnimationFrame call, so scroll-linked animations (useScroll /
    // useTransform in Projects.tsx) stay perfectly in sync with the smooth
    // scroll position instead of reading stale/lagging scroll values.
    frame.update(update, true);
    return () => cancelFrame(update);
  }, [lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        // Lower = heavier/weightier feel, higher = snappier. 1.1–1.3 is a
        // common "premium" feel without being sluggish.
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      <LenisFrameSync />
      {children}
    </ReactLenis>
  );
}
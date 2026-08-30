"use client";

import { useEffect, useState } from "react";
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
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-primary devices (phones/tablets) where Lenis smooth
    // scrolling fights native inertia and makes scroll-driven animations laggy.
    const touch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(touch);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        // Lower = heavier/weightier feel, higher = snappier. 1.1–1.3 is a
        // common "premium" feel without being sluggish.
        lerp: isTouchDevice ? 1 : 0.1,
        duration: isTouchDevice ? 0 : 1.2,
        smoothWheel: !isTouchDevice,
        syncTouch: false,
      }}
    >
      <LenisFrameSync />
      {children}
    </ReactLenis>
  );
}
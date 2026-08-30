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
  const [mounted, setMounted] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-primary devices (phones/tablets) where Lenis smooth
    // scrolling fights native inertia and makes scroll-driven animations laggy.
    const touch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(touch);
    setMounted(true);
  }, []);

  // On touch screens / phones, bypass Lenis completely to let the browser's
  // hardware-accelerated 120Hz/60Hz compositor handle scrolling with zero overhead.
  if (!mounted || isTouchDevice) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
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
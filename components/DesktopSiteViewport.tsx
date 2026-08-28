"use client";

import { useEffect } from "react";

const DESKTOP_LAYOUT_WIDTH = "1280";

function isDesktopSiteOnPhone() {
  return window.screen.width < 768 && window.innerWidth >= 768;
}

export default function DesktopSiteViewport() {
  useEffect(() => {
    if (!isDesktopSiteOnPhone()) return;

    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "viewport");
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", `width=${DESKTOP_LAYOUT_WIDTH}`);
  }, []);

  return null;
}

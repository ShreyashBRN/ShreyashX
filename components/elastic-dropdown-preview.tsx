"use client";

import { ElasticDropdown } from "@/components/elastic-dropdown";

export default function ElasticDropdownPreview() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "360px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(100%, 260px)",
          zIndex: 10,
        }}
      >
        <ElasticDropdown placeholder="Project" />
      </div>
    </div>
  );
}
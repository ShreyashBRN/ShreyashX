"use client";

import { AnimatedSidebar } from "@/components/flow-sidebar";

const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "history", label: "History" },
    { id: "overview", label: "Overview" },
    { id: "architecture", label: "Architecture" },
    { id: "implementation", label: "Implementation" },
    { id: "references", label: "References" },
];

export default function FlowSidebarPreview() {
  return <AnimatedSidebar sections={sections} accentColor="#ff5a4f" />;
}
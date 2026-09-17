"use client";

import { JellyToolbar, type JellyToolbarItem } from "@/components/jelly-toolbar";
import {
  MessageSquare,
  Inbox,
  Settings,
  Eye,
  Send,
  Menu as MenuIcon,
} from "lucide-react";

const items: JellyToolbarItem[] = [
  { label: "Chat", icon: MessageSquare, shortcut: "C" },
  { label: "Inbox", icon: Inbox, shortcut: "I" },
  { label: "Settings", icon: Settings, shortcut: "S" },
  { label: "Preview", icon: Eye, shortcut: "P" },
  { label: "Send", icon: Send, shortcut: "E" },
  { label: "Menu", icon: MenuIcon, shortcut: "M" },
];

export default function JellyToolbarPreview() {
  return <JellyToolbar items={items} />;
}
"use client";

import {
  ElasticDropdown,
  type ElasticDropdownOption,
  UserIcon,
  UserFilledIcon,
  BriefcaseIcon,
  BriefcaseFilledIcon,
  PaletteIcon,
  PaletteFilledIcon,
  CodeIcon,
  CodeFilledIcon,
  FinanceIcon,
  FinanceFilledIcon,
} from "@/components/elastic-dropdown";

const options: ElasticDropdownOption[] = [
  { value: "personal", label: "Personal", icon: UserIcon, filledIcon: UserFilledIcon },
  { value: "work", label: "Work", icon: BriefcaseIcon, filledIcon: BriefcaseFilledIcon },
  { value: "design", label: "Design", icon: PaletteIcon, filledIcon: PaletteFilledIcon },
  { value: "development", label: "Development", icon: CodeIcon, filledIcon: CodeFilledIcon },
  { value: "finance", label: "Finance", icon: FinanceIcon, filledIcon: FinanceFilledIcon },
];

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
        <ElasticDropdown placeholder="Project" options={options} />
      </div>
    </div>
  );
}
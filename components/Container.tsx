import { ReactNode } from "react";

export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding)] sm:px-[var(--container-padding-sm)] ${className}`}
    >
      {children}
    </div>
  );
}

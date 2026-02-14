"use client";

import { cn } from "@/lib/utils/cn";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className,
  dark = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-6 md:px-12 lg:px-20 py-20 md:py-28",
        dark
          ? "bg-[var(--color-navy)] text-white"
          : "bg-[var(--color-bg)]",
        className
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

"use client";

import { cn } from "@/lib/utils/cn";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  alt?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className,
  dark = false,
  alt = false,
}: SectionWrapperProps) {
  // On cream sections, cards are white. On white sections, cards are cream.
  const cardBg = alt ? "var(--color-bg)" : "var(--color-bg-alt)";

  return (
    <section
      id={id}
      className={cn(
        "px-6 md:px-12 lg:px-20 py-12 md:py-16",
        dark
          ? "bg-[var(--color-navy)] text-white"
          : alt
            ? "bg-[var(--color-bg-alt)] section-depth"
            : "bg-[var(--color-bg)] section-depth",
        className
      )}
      style={{ "--color-card-bg": cardBg } as React.CSSProperties}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

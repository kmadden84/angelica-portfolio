"use client";

import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  number?: string;
  title: string;
  className?: string;
}

export function SectionHeading({ title, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      <div className="h-px w-16 bg-[var(--color-accent)] opacity-40 mb-4" />
      <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold leading-tight tracking-tight">
        {title}
      </h2>
    </div>
  );
}

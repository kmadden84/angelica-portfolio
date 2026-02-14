"use client";

import { cn } from "@/lib/utils/cn";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-lavender)] text-[var(--color-text)]",
        className
      )}
    >
      {children}
    </span>
  );
}

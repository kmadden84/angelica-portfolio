"use client";

import { cn } from "@/lib/utils/cn";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  size?: "bento-large" | "bento-medium" | "bento-small";
}

export function BentoCard({
  children,
  className,
  size = "bento-medium",
}: BentoCardProps) {
  const sizeClasses = {
    "bento-large": "sm:col-span-2 sm:row-span-2",
    "bento-medium": "sm:col-span-1 sm:row-span-1",
    "bento-small": "sm:col-span-1",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-[var(--color-text)]/5 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/30 h-full group/card",
        sizeClasses[size],
        className
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-[var(--color-accent)]/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

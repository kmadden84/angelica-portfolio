"use client";

import { cn } from "@/lib/utils/cn";

interface WaveDividerProps {
  /** "light-to-light" keeps same bg, "light-to-dark" transitions to dark section */
  variant?: "subtle" | "to-dark" | "from-dark";
  className?: string;
  flip?: boolean;
}

export function WaveDivider({ variant = "subtle", className, flip = false }: WaveDividerProps) {
  const fill =
    variant === "to-dark"
      ? "var(--color-dark)"
      : variant === "from-dark"
        ? "var(--color-bg)"
        : "var(--color-bg)";

  const bg =
    variant === "to-dark"
      ? "bg-[var(--color-bg)]"
      : variant === "from-dark"
        ? "bg-[var(--color-dark)]"
        : "bg-[var(--color-bg)]";

  return (
    <div
      className={cn(
        "w-full overflow-hidden leading-[0] relative",
        bg,
        flip && "rotate-180",
        className
      )}
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="w-full h-[40px] md:h-[60px] block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill={fill}
          fillOpacity={variant === "subtle" ? "0.5" : "1"}
        />
        {variant === "subtle" && (
          <path
            d="M0,40 C360,10 720,55 1080,25 C1260,15 1380,35 1440,40 L1440,60 L0,60 Z"
            fill={fill}
            fillOpacity="0.3"
          />
        )}
      </svg>
    </div>
  );
}

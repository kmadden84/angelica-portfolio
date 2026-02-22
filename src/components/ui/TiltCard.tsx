"use client";

import { useCallback, useRef, useState } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });
  const rafRef = useRef<number>(0);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const card = cardRef.current;
      if (!card) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateX = (-mouseY / (rect.height / 2)) * maxTilt;
        const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

        setTransform(
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
        );

        if (glare) {
          const glareX = ((mouseX + rect.width / 2) / rect.width) * 100;
          const glareY = ((mouseY + rect.height / 2) / rect.height) * 100;
          setGlareStyle({
            opacity: 0.15,
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
          });
        }
      });
    },
    [maxTilt, glare, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (prefersReducedMotion) return;
    cancelAnimationFrame(rafRef.current);
    setTransform("");
    setGlareStyle({ opacity: 0 });
  }, [prefersReducedMotion]);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform || "perspective(800px) rotateX(0deg) rotateY(0deg)",
        transition: transform ? "none" : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl z-20"
          style={{
            ...glareStyle,
            transition: glareStyle.opacity ? "none" : "opacity 0.5s ease",
          }}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  number?: string;
  title: string;
  className?: string;
}

export function SectionHeading({ title, className }: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const words = el.querySelectorAll<HTMLSpanElement>(".heading-word");
    const line = el.querySelector<HTMLDivElement>(".accent-line");

    // Set initial state
    gsap.set(words, { y: "100%", opacity: 0 });
    if (line) gsap.set(line, { width: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    // Animate accent line
    if (line) {
      tl.to(line, {
        width: 64,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    // Animate words with stagger
    tl.to(
      words,
      {
        y: "0%",
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
      },
      line ? "-=0.3" : 0
    );

    return () => {
      tl.kill();
    };
  }, [title]);

  const words = title.split(" ");

  return (
    <div ref={containerRef} className={cn("mb-8 md:mb-10", className)}>
      <div
        className="accent-line h-px bg-[var(--color-accent)] opacity-40 mb-4"
        style={{ width: 64 }}
      />
      <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold leading-tight tracking-tight font-[family-name:var(--font-playfair)] flex flex-wrap">
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block mr-[0.3em]">
            <span className="heading-word inline-block">{word}</span>
          </span>
        ))}
      </h2>
    </div>
  );
}

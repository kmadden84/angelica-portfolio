"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Tag } from "@/components/ui/Tag";
import { RichText } from "@/components/ui/RichText";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { contentfulImageUrl } from "@/lib/utils/constants";
import type { Education as EducationType } from "@/types/contentful";
import type { Asset } from "contentful";

interface EducationProps {
  data: EducationType[];
  alt?: boolean;
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } })
    .fields?.file;
  return file?.url || "";
}

/* ── Card ──────────────────────────────────────────────────────── */

function EduCard({ edu }: { edu: EducationType }) {
  const logoUrl = getAssetUrl(edu.institutionLogo);

  return (
    <div className="rounded-2xl border border-[var(--color-text)]/10 bg-[var(--color-card-bg)] p-5 shadow-sm h-full">
      <div className="flex items-start gap-3">
        {logoUrl && (
          <Image
            src={contentfulImageUrl(logoUrl, 80)}
            alt={edu.institution}
            width={36}
            height={36}
            className="rounded-lg shrink-0 mt-0.5"
            unoptimized
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--color-accent)] mb-1">
            {edu.dateRange}
          </p>
          <h3 className="text-base font-bold leading-snug mb-0.5">
            {edu.program}
          </h3>
          <p className="text-sm text-[var(--color-text-tertiary)]">{edu.institution}</p>
        </div>
      </div>

      {edu.description && (
        <RichText
          content={edu.description}
          className="text-sm text-[var(--color-text-secondary)] mt-3"
        />
      )}

      {edu.focusAreas && edu.focusAreas.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {edu.focusAreas.map((area) => (
            <Tag key={area}>{area}</Tag>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Desktop: horizontal scrollable zigzag ─────────────────────── */

function HorizontalTimeline({ items }: { items: EducationType[] }) {
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardWidth = 280;
  const gap = 24;
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    return () => el.removeEventListener("scroll", updateEdges);
  }, [updateEdges]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = cardWidth + gap;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount * 2 : amount * 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="hidden md:block relative">
      {/* Scroll arrow buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--color-card-bg)] border border-[var(--color-text)]/10 shadow-md flex items-center justify-center hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/30 transition-colors cursor-pointer"
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--color-card-bg)] border border-[var(--color-text)]/10 shadow-md flex items-center justify-center hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/30 transition-colors cursor-pointer"
        aria-label="Scroll right"
      >
        <ChevronRight size={18} />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Grid layout */}
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${items.length}, ${cardWidth}px)`,
            gridTemplateRows: "auto 24px auto",
            columnGap: `${gap}px`,
            width: `${items.length * cardWidth + (items.length - 1) * gap}px`,
          }}
        >
          {/* Row 1: cards ABOVE the line (even: 0, 2, 4…) */}
          {items.map((edu, i) => (
            <div
              key={`top-${i}`}
              className="flex items-end pb-4"
              style={{ gridRow: 1, gridColumn: i + 1 }}
            >
              {i % 2 === 0 ? (
                <motion.div
                  className="w-full"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.45, delay: 0.05 }}
                >
                  <EduCard edu={edu} />
                </motion.div>
              ) : (
                <div />
              )}
            </div>
          ))}

          {/* Row 2: horizontal line + dots */}
          {items.map((_, i) => (
            <div
              key={`mid-${i}`}
              className="relative flex items-center justify-center"
              style={{ gridRow: 2, gridColumn: i + 1 }}
            >
              {/* Horizontal line spanning column + gap */}
              <div
                className="absolute top-1/2 h-0.5 bg-[var(--color-accent)]/25 -translate-y-1/2"
                style={{
                  left: i === 0 ? "50%" : `-${gap / 2}px`,
                  right: i === items.length - 1 ? "50%" : `-${gap / 2}px`,
                }}
              />

              {/* Vertical stem to card */}
              <div
                className="absolute left-1/2 w-0.5 bg-[var(--color-accent)]/25 -translate-x-1/2"
                style={{
                  top: i % 2 === 0 ? "-16px" : "50%",
                  bottom: i % 2 === 0 ? "50%" : "-16px",
                }}
              />

              {/* Accent dot */}
              <motion.div
                className="relative z-10 w-3 h-3 rounded-full bg-[var(--color-accent)] border-2 border-[var(--color-bg-alt)] shadow-sm"
                initial={shouldReduceMotion ? undefined : { scale: 0 }}
                whileInView={shouldReduceMotion ? undefined : { scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
              />
            </div>
          ))}

          {/* Row 3: cards BELOW the line (odd: 1, 3, 5…) */}
          {items.map((edu, i) => (
            <div
              key={`bot-${i}`}
              className="flex items-start pt-4"
              style={{ gridRow: 3, gridColumn: i + 1 }}
            >
              {i % 2 === 1 ? (
                <motion.div
                  className="w-full"
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: -24 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.45, delay: 0.05 }}
                >
                  <EduCard edu={edu} />
                </motion.div>
              ) : (
                <div />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fade edges — hidden when scrolled to that end */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[var(--color-bg-alt)] to-transparent pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: atStart ? 0 : 1 }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-r from-transparent to-[var(--color-bg-alt)] pointer-events-none z-10 transition-opacity duration-300"
        style={{ opacity: atEnd ? 0 : 1 }}
      />
    </div>
  );
}

/* ── Mobile: vertical stack ────────────────────────────────────── */

function MobileTimeline({ items }: { items: EducationType[] }) {
  return (
    <div className="md:hidden relative">
      {/* Vertical accent line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-text)]/10" />

      <div className="space-y-8">
        {items.map((edu, index) => (
          <RevealOnScroll key={index} delay={index * 0.08}>
            <div className="relative pl-10">
              {/* Timeline dot */}
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-[var(--color-accent)] border-2 border-[var(--color-bg-alt)] shadow-sm" />
              <EduCard edu={edu} />
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────── */

export function Education({ data, alt }: EducationProps) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <SectionWrapper id="education" alt={alt}>
      <RevealOnScroll>
        <SectionHeading number="05" title="Education" />
      </RevealOnScroll>

      <HorizontalTimeline items={sorted} />
      <MobileTimeline items={sorted} />
    </SectionWrapper>
  );
}

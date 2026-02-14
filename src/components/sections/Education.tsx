"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } })
    .fields?.file;
  return file?.url || "";
}

/* ── Card used in both desktop zigzag and mobile stack ──────────── */

function EduCard({ edu }: { edu: EducationType }) {
  const logoUrl = getAssetUrl(edu.institutionLogo);

  return (
    <div className="rounded-2xl border border-[var(--color-text)]/5 bg-white p-5 shadow-sm">
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
          <p className="text-sm text-[var(--color-text)]/60">{edu.institution}</p>
        </div>
      </div>

      {edu.description && (
        <RichText
          content={edu.description}
          className="text-sm text-[var(--color-text)]/70 mt-3"
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

/* ── Desktop zigzag timeline ────────────────────────────────────── */

function ZigzagTimeline({ items }: { items: EducationType[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="hidden md:block relative">
      {/* CSS Grid: one column per entry */}
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
          gridTemplateRows: "auto auto auto",
        }}
      >
        {/* Row 1: cards that sit ABOVE the line (even indices: 0, 2, 4…) */}
        {items.map((edu, i) => {
          const isAbove = i % 2 === 0;
          return (
            <div
              key={`top-${i}`}
              className="flex items-end justify-center px-2 pb-4"
              style={{ gridRow: 1, gridColumn: i + 1 }}
            >
              {isAbove ? (
                <motion.div
                  className="w-full"
                  initial={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 0, y: 30 }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <EduCard edu={edu} />
                </motion.div>
              ) : (
                <div />
              )}
            </div>
          );
        })}

        {/* Row 2: horizontal line + dots */}
        {items.map((_, i) => (
          <div
            key={`mid-${i}`}
            className="relative flex items-center justify-center"
            style={{ gridRow: 2, gridColumn: i + 1, height: "24px" }}
          >
            {/* Horizontal line segment spanning full column width */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[var(--color-accent)]/30 -translate-y-1/2" />

            {/* Vertical stem */}
            <div
              className="absolute left-1/2 w-0.5 bg-[var(--color-accent)]/30 -translate-x-1/2"
              style={{
                top: i % 2 === 0 ? "-16px" : "50%",
                bottom: i % 2 === 0 ? "50%" : "-16px",
              }}
            />

            {/* Accent dot */}
            <motion.div
              className="relative z-10 w-3.5 h-3.5 rounded-full bg-[var(--color-accent)] border-2 border-white shadow-sm"
              initial={
                shouldReduceMotion ? undefined : { scale: 0 }
              }
              whileInView={
                shouldReduceMotion ? undefined : { scale: 1 }
              }
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: i * 0.15 + 0.2,
              }}
            />
          </div>
        ))}

        {/* Row 3: cards that sit BELOW the line (odd indices: 1, 3, 5…) */}
        {items.map((edu, i) => {
          const isBelow = i % 2 === 1;
          return (
            <div
              key={`bot-${i}`}
              className="flex items-start justify-center px-2 pt-4"
              style={{ gridRow: 3, gridColumn: i + 1 }}
            >
              {isBelow ? (
                <motion.div
                  className="w-full"
                  initial={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 0, y: -30 }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? undefined
                      : { opacity: 1, y: 0 }
                  }
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <EduCard edu={edu} />
                </motion.div>
              ) : (
                <div />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Mobile fallback: vertical stack ────────────────────────────── */

function MobileTimeline({ items }: { items: EducationType[] }) {
  return (
    <div className="md:hidden relative">
      {/* Vertical accent line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-text)]/10" />

      <div className="space-y-8">
        {items.map((edu, index) => (
          <RevealOnScroll key={index} delay={index * 0.12}>
            <div className="relative pl-10">
              {/* Timeline dot */}
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-[var(--color-accent)] border-2 border-white shadow-sm" />
              <EduCard edu={edu} />
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────── */

export function Education({ data }: EducationProps) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <SectionWrapper id="education">
      <RevealOnScroll>
        <SectionHeading number="05" title="Education" />
      </RevealOnScroll>

      <ZigzagTimeline items={sorted} />
      <MobileTimeline items={sorted} />
    </SectionWrapper>
  );
}

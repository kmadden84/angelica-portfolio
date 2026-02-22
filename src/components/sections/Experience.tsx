"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Tag } from "@/components/ui/Tag";
import { RichText } from "@/components/ui/RichText";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { contentfulImageUrl } from "@/lib/utils/constants";
import type { Experience as ExperienceType } from "@/types/contentful";
import type { Asset } from "contentful";

interface ExperienceProps {
  data: ExperienceType[];
  alt?: boolean;
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } })
    .fields?.file;
  return file?.url || "";
}

function ExperienceEntry({ exp, index }: { exp: ExperienceType; index: number }) {
  const logoUrl = getAssetUrl(exp.companyLogo);

  return (
    <RevealOnScroll key={index} delay={index * 0.15}>
      <div className="relative pl-12 md:pl-20">
        {/* Timeline dot */}
        <div className="absolute left-2.5 md:left-6.5 top-1 w-3 h-3 rounded-full bg-[var(--color-accent)] border-2 border-[var(--color-bg)] shadow-sm" />

        <div className="flex items-start gap-4">
          {logoUrl && (
            <Image
              src={contentfulImageUrl(logoUrl, 80)}
              alt={exp.company}
              width={40}
              height={40}
              className="rounded-lg shrink-0 mt-1"
              unoptimized
            />
          )}

          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-accent)] mb-1">
              {exp.dateRange}
            </p>
            <h3 className="text-xl font-bold mb-1">
              {exp.jobTitle}
            </h3>
            <p className="text-base text-[var(--color-text-tertiary)] mb-3">
              {exp.company}
            </p>

            {exp.description && (
              <RichText
                content={exp.description}
                className="text-sm text-[var(--color-text-secondary)] mb-3"
              />
            )}

            {exp.tags && exp.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}

export function Experience({ data, alt }: ExperienceProps) {
  const [expanded, setExpanded] = useState(false);

  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
  const first = sorted[0];
  const rest = sorted.slice(1);
  const hasMore = rest.length > 0;

  return (
    <SectionWrapper id="experience" alt={alt}>
      <RevealOnScroll>
        <SectionHeading number="04" title="Experience" />
      </RevealOnScroll>

      <div className="relative">
        {/* Vertical accent line */}
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-[var(--color-text)]/10" />

        <div className="space-y-12">
          <ExperienceEntry exp={first} index={0} />

          <AnimatePresence initial={false}>
            {expanded && rest.map((exp, i) => (
              <motion.div
                key={i + 1}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <ExperienceEntry exp={exp} index={i + 1} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View More / View Less toggle */}
        {hasMore && (
          <RevealOnScroll>
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setExpanded(!expanded)}
                className="group inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-full border-2 border-[var(--color-text)]/20 text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-300 cursor-pointer"
              >
                {expanded ? "Show Less" : `View All ${sorted.length} Roles`}
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} />
                </motion.span>
              </button>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </SectionWrapper>
  );
}

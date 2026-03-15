"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { BentoGrid, BentoCard } from "@/components/ui/BentoGrid";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SkillIcon } from "./SkillIcon";
import type { SkillCategory } from "@/types/contentful";

interface StrengthsProps {
  data: SkillCategory[];
  alt?: boolean;
}

function SkillCard({ cat }: { cat: SkillCategory }) {
  return (
    <BentoCard size={cat.displayStyle || "bento-medium"}>
      <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-4">
        {cat.categoryName}
      </h3>
      <div className="space-y-3">
        {cat.skills.map((skill) => (
          <div key={skill.name} className="flex items-center gap-3 group">
            <SkillIcon
              name={skill.icon}
              className="w-5 h-5 text-[var(--color-text-label)] group-hover:text-[var(--color-accent)] transition-colors"
            />
            <span className="text-sm font-medium">{skill.name}</span>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

export function Strengths({ data, alt }: StrengthsProps) {
  const [expanded, setExpanded] = useState(false);

  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
  const firstRow = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const hasMore = rest.length > 0;

  return (
    <SectionWrapper id="strengths" alt={alt}>
      <RevealOnScroll>
        <SectionHeading number="04" title="Core Competencies" />
      </RevealOnScroll>

      <StaggerChildren>
        <BentoGrid>
          {firstRow.map((cat) => (
            <StaggerItem key={cat.categoryName} className="h-full">
              <SkillCard cat={cat} />
            </StaggerItem>
          ))}
        </BentoGrid>
      </StaggerChildren>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <BentoGrid>
                {rest.map((cat) => (
                  <div key={cat.categoryName} className="h-full">
                    <SkillCard cat={cat} />
                  </div>
                ))}
              </BentoGrid>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasMore && (
        <RevealOnScroll>
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setExpanded(!expanded)}
              className="group inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-full border-2 border-[var(--color-text)]/20 text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-300 cursor-pointer"
            >
              {expanded ? "Show Less" : `View All ${sorted.length} Competencies`}
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
    </SectionWrapper>
  );
}

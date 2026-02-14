"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { BentoGrid, BentoCard } from "@/components/ui/BentoGrid";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SkillIcon } from "./SkillIcon";
import type { SkillCategory } from "@/types/contentful";

interface StrengthsProps {
  data: SkillCategory[];
}

export function Strengths({ data }: StrengthsProps) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <SectionWrapper id="strengths">
      <RevealOnScroll>
        <SectionHeading number="03" title="Strengths" />
      </RevealOnScroll>

      <StaggerChildren staggerDelay={0.12}>
        <BentoGrid>
          {sorted.map((cat) => (
            <StaggerItem key={cat.categoryName} className="h-full">
              <BentoCard size={cat.displayStyle || "bento-medium"}>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-4">
                  {cat.categoryName}
                </h3>
                <div className="space-y-3">
                  {cat.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-3 group">
                      <SkillIcon
                        name={skill.icon}
                        className="w-5 h-5 text-[var(--color-text)]/40 group-hover:text-[var(--color-accent)] transition-colors"
                      />
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </BentoCard>
            </StaggerItem>
          ))}
        </BentoGrid>
      </StaggerChildren>
    </SectionWrapper>
  );
}

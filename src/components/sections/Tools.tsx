"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { BentoGrid, BentoCard } from "@/components/ui/BentoGrid";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { SkillIcon } from "./SkillIcon";
import type { SkillCategory } from "@/types/contentful";

interface ToolsProps {
  data: SkillCategory[];
}

export function Tools({ data }: ToolsProps) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <SectionWrapper id="tools">
      <RevealOnScroll>
        <SectionHeading number="06" title="Tools & Technologies" />
      </RevealOnScroll>

      <StaggerChildren staggerDelay={0.12}>
        <BentoGrid>
          {sorted.map((cat) => (
            <StaggerItem key={cat.categoryName} className="h-full">
              <BentoCard size={cat.displayStyle || "bento-medium"}>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-4">
                  {cat.categoryName}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-lavender)]/30 transition-colors group"
                    >
                      <SkillIcon
                        name={skill.icon}
                        className="w-5 h-5 text-[var(--color-text)]/40 group-hover:text-[var(--color-accent)] group-hover:scale-110 transition-all"
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

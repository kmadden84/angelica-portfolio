"use client";

import Image from "next/image";
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
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } })
    .fields?.file;
  return file?.url || "";
}

export function Experience({ data }: ExperienceProps) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <SectionWrapper id="experience">
      <RevealOnScroll>
        <SectionHeading number="04" title="Experience" />
      </RevealOnScroll>

      <div className="relative">
        {/* Vertical accent line */}
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-[var(--color-text)]/10" />

        <div className="space-y-12">
          {sorted.map((exp, index) => {
            const logoUrl = getAssetUrl(exp.companyLogo);

            return (
              <RevealOnScroll key={index} delay={index * 0.15}>
                <div className="relative pl-12 md:pl-20">
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 md:left-6.5 top-1 w-3 h-3 rounded-full bg-[var(--color-accent)] border-2 border-white shadow-sm" />

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
                      <p className="text-base text-[var(--color-text)]/60 mb-3">
                        {exp.company}
                      </p>

                      {exp.description && (
                        <RichText
                          content={exp.description}
                          className="text-sm text-[var(--color-text)]/70 mb-3"
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
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}

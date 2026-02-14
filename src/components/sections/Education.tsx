"use client";

import Image from "next/image";
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
  const file = (asset as unknown as { fields: { file: { url: string } } }).fields?.file;
  return file?.url || "";
}

export function Education({ data }: EducationProps) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <SectionWrapper id="education">
      <RevealOnScroll>
        <SectionHeading number="04" title="Education" />
      </RevealOnScroll>

      <div className="relative">
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-[var(--color-text)]/10" />

        <div className="space-y-12">
          {sorted.map((edu, index) => {
            const logoUrl = getAssetUrl(edu.institutionLogo);

            return (
              <RevealOnScroll key={index} delay={index * 0.15}>
                <div className="relative pl-12 md:pl-20">
                  <div className="absolute left-2.5 md:left-6.5 top-1 w-3 h-3 rounded-full bg-[var(--color-accent)] border-2 border-white shadow-sm" />

                  <div className="flex items-start gap-4">
                    {logoUrl && (
                      <Image
                        src={contentfulImageUrl(logoUrl, 80)}
                        alt={edu.institution}
                        width={40}
                        height={40}
                        className="rounded-lg shrink-0 mt-1"
                        unoptimized
                      />
                    )}

                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--color-accent)] mb-1">
                        {edu.dateRange}
                      </p>
                      <h3 className="text-xl font-bold mb-1">{edu.program}</h3>
                      <p className="text-base text-[var(--color-text)]/60 mb-3">
                        {edu.institution}
                      </p>

                      {edu.description && (
                        <RichText
                          content={edu.description}
                          className="text-sm text-[var(--color-text)]/70 mb-3"
                        />
                      )}

                      {edu.focusAreas && edu.focusAreas.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {edu.focusAreas.map((area) => (
                            <Tag key={area}>{area}</Tag>
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

"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { RichText } from "@/components/ui/RichText";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { contentfulImageUrl } from "@/lib/utils/constants";
import type { AboutSection } from "@/types/contentful";
import type { Asset } from "contentful";

interface AboutProps {
  data: AboutSection | null;
  alt?: boolean;
  projectCount?: number;
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } }).fields?.file;
  return file?.url || "";
}

export function About({ data, alt, projectCount }: AboutProps) {
  if (!data) return null;

  const photoUrl = getAssetUrl(data.photo);
  const rawHighlights = data.highlights as { label: string; value: string }[] | undefined;
  const highlights = rawHighlights?.map((h) => {
    if (h.label.toLowerCase() === "projects" && projectCount != null) {
      return { ...h, value: `${projectCount}+` };
    }
    return h;
  });

  return (
    <SectionWrapper id="about" alt={alt}>
      <RevealOnScroll>
        <SectionHeading number="01" title={data.heading} />
      </RevealOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        <RevealOnScroll className="lg:col-span-3">
          <RichText
            content={data.bio}
            className="text-[var(--color-text-secondary)] leading-relaxed"
          />
        </RevealOnScroll>

        <div className="lg:col-span-2 space-y-8">
          {photoUrl && (
            <RevealOnScroll direction="right">
              <ParallaxImage
                src={contentfulImageUrl(photoUrl, 600)}
                alt="About photo"
                width={600}
                height={600}
              />
            </RevealOnScroll>
          )}

          {highlights && highlights.length > 0 && (
            <StaggerChildren className="grid grid-cols-3 gap-2 sm:gap-4" staggerDelay={0.15}>
              {highlights.map((h) => (
                <StaggerItem key={h.label}>
                  <div className="text-center p-2 sm:p-4 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-text)]/10 min-w-0">
                    <AnimatedCounter
                      value={h.value}
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-accent)] block truncate"
                    />
                    <p className="font-medium text-[var(--color-text-muted)] mt-1 uppercase tracking-wide truncate text-[clamp(0.45rem,1.8vw,0.75rem)]">
                      {h.label}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

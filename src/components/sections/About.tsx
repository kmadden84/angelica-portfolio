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
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } }).fields?.file;
  return file?.url || "";
}

export function About({ data }: AboutProps) {
  if (!data) return null;

  const photoUrl = getAssetUrl(data.photo);
  const highlights = data.highlights as { label: string; value: string }[] | undefined;

  return (
    <SectionWrapper id="about">
      <RevealOnScroll>
        <SectionHeading number="01" title={data.heading} />
      </RevealOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
        <RevealOnScroll className="lg:col-span-3">
          <RichText
            content={data.bio}
            className="text-[var(--color-text)]/80 leading-relaxed"
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
            <StaggerChildren className="grid grid-cols-3 gap-4" staggerDelay={0.15}>
              {highlights.map((h) => (
                <StaggerItem key={h.label}>
                  <div className="text-center p-4 rounded-xl bg-white border border-[var(--color-text)]/5">
                    <AnimatedCounter
                      value={h.value}
                      className="text-2xl md:text-3xl font-bold text-[var(--color-accent)] block"
                    />
                    <p className="text-xs font-medium text-[var(--color-text)]/50 mt-1 uppercase tracking-wider">
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

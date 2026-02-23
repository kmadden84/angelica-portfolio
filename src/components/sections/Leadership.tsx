"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { RichText } from "@/components/ui/RichText";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { contentfulImageUrl } from "@/lib/utils/constants";
import type { LeadershipActivity } from "@/types/contentful";
import type { Asset } from "contentful";

interface LeadershipProps {
  data: LeadershipActivity[];
  alt?: boolean;
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } }).fields?.file;
  return file?.url || "";
}

export function Leadership({ data, alt }: LeadershipProps) {
  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <SectionWrapper id="leadership" alt={alt}>
      <RevealOnScroll>
        <SectionHeading number="06" title="Leadership & Initiatives" />
      </RevealOnScroll>

      <div className="space-y-5">
        {sorted.map((activity, index) => {
          const imageUrl = getAssetUrl(activity.image);

          return (
            <RevealOnScroll key={index} delay={index * 0.08}>
              <div className="rounded-2xl border border-[var(--color-text)]/10 bg-[var(--color-card-bg)] overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col md:flex-row">
                {imageUrl && (
                  <div className="md:w-64 lg:w-80 flex-shrink-0">
                    <ParallaxImage
                      src={contentfulImageUrl(imageUrl, 600)}
                      alt={activity.title}
                      width={600}
                      height={400}
                      className="h-48 md:h-full !rounded-none md:!rounded-l-2xl"
                      imageClassName="h-full object-[center_75%] md:object-center"
                    />
                  </div>
                )}

                <div className="p-6 flex-1 min-w-0">
                  <h3 className="text-lg font-bold mb-1">{activity.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0 mb-3">
                    {activity.organization && (
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {activity.organization}
                      </p>
                    )}
                    {activity.organization && activity.dateRange && (
                      <span className="text-[var(--color-text-muted)]">·</span>
                    )}
                    {activity.dateRange && (
                      <p className="text-xs text-[var(--color-accent)] font-medium">
                        {activity.dateRange}
                      </p>
                    )}
                  </div>
                  <RichText
                    content={activity.description}
                    className="text-sm text-[var(--color-text-secondary)]"
                  />
                </div>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

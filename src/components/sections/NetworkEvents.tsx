"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { contentfulImageUrl } from "@/lib/utils/constants";
import type { NetworkEventsSection } from "@/types/contentful";
import type { Asset } from "contentful";

interface NetworkEventsProps {
  data: NetworkEventsSection | null;
  alt?: boolean;
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } })
    .fields?.file;
  return file?.url || "";
}

export function NetworkEvents({ data, alt }: NetworkEventsProps) {
  if (!data) return null;

  const images = (data.images ?? [])
    .map((img) => ({
      url: getAssetUrl(img),
      alt:
        (img as unknown as { fields: { title?: string } }).fields?.title || "",
    }))
    .filter((img) => img.url);

  if (images.length === 0) return null;

  return (
    <SectionWrapper id="network-events" alt={alt}>
      <RevealOnScroll>
        <SectionHeading number="07" title={data.heading} />
      </RevealOnScroll>

      {data.subheading && (
        <RevealOnScroll delay={0.1}>
          <h3 className="text-lg font-semibold text-[var(--color-text-secondary)] mb-6">
            {data.subheading}
          </h3>
        </RevealOnScroll>
      )}

      <StaggerChildren
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {images.map((img, i) => (
          <StaggerItem key={i}>
            <div className="rounded-2xl overflow-hidden border border-[var(--color-text)]/10 bg-[var(--color-card-bg)] transition-all duration-300 hover:shadow-md">
              <ParallaxImage
                src={contentfulImageUrl(img.url, 600)}
                alt={img.alt}
                width={600}
                height={400}
                className="w-full h-56 sm:h-64 object-cover"
                imageClassName={i === images.length - 1 ? "h-full object-[center_75%]" : undefined}
              />
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </SectionWrapper>
  );
}

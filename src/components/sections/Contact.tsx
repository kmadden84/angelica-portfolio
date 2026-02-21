"use client";

import {
  Mail,
  MapPin,
  Linkedin,
  Phone,
  Youtube,
  Instagram,
  Facebook,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { TextReveal } from "@/components/animations/TextReveal";
import type { ContactSection } from "@/types/contentful";

const linkIconMap: Record<string, LucideIcon> = {
  Youtube,
  Instagram,
  Facebook,
  Linkedin,
};

interface ContactProps {
  data: ContactSection | null;
}

export function Contact({ data }: ContactProps) {
  if (!data) return null;

  const links = data.additionalLinks as
    | { label: string; url: string; icon?: string }[]
    | undefined;

  return (
    <section
      id="contact"
      className="px-6 md:px-12 lg:px-20 py-12 md:py-16 bg-[#353547] text-white"
    >
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll>
          <SectionHeading
            number="07"
            title={data.heading}
            className="[&_h2]:text-white !mb-4 md:!mb-6"
          />
        </RevealOnScroll>

        {data.subheading && (
          <RevealOnScroll delay={0.1}>
            <p className="text-base text-white/65 max-w-2xl mb-6 leading-relaxed">
              {data.subheading}
            </p>
          </RevealOnScroll>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: contact details */}
          <StaggerChildren className="flex flex-col gap-3" staggerDelay={0.1}>
            <StaggerItem>
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[var(--color-accent)]/25 transition-colors">
                  <Mail size={18} />
                </div>
                <span>{data.email}</span>
              </a>
            </StaggerItem>

            <StaggerItem>
              <a
                href="tel:+16476139984"
                className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[var(--color-accent)]/25 transition-colors">
                  <Phone size={18} />
                </div>
                <span>647-613-9984</span>
              </a>
            </StaggerItem>

            {data.location && (
              <StaggerItem>
                <div className="flex items-center gap-3 text-white/55">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <span>{data.location}</span>
                </div>
              </StaggerItem>
            )}
          </StaggerChildren>

          {/* Right: CTA + social icons */}
          <RevealOnScroll direction="right" delay={0.2}>
            <div className="flex flex-col items-start md:items-end gap-6">
              <TextReveal
                text="Let's build something great together."
                tag="p"
                className="text-xl md:text-2xl font-bold text-white md:text-right"
              />
              <MagneticButton>
                <Button variant="primary" size="lg" href={`mailto:${data.email}`}>
                  Get In Touch
                </Button>
              </MagneticButton>

              {/* Social icons row */}
              <div className="flex items-center gap-3">
                {data.linkedinUrl && (
                  <a
                    href={data.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[var(--color-accent)]/25 transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {links?.map((link) => {
                  const IconComp = link.icon ? linkIconMap[link.icon] : null;
                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[var(--color-accent)]/25 transition-colors"
                    >
                      {IconComp ? <IconComp size={18} /> : <ExternalLink size={18} />}
                    </a>
                  );
                })}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

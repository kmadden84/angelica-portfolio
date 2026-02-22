"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contentfulImageUrl } from "@/lib/utils/constants";
import type { HeroSection } from "@/types/contentful";
import type { Asset } from "contentful";

interface HeroProps {
  data: HeroSection | null;
  resumeUrl?: string;
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } })
    .fields?.file;
  return file?.url || "";
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export function Hero({ data, resumeUrl }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  if (!data) return null;

  const photoUrl = getAssetUrl(data.profilePhoto);
  const bgUrl = getAssetUrl(data.backgroundMedia);
  const anim = shouldReduceMotion
    ? () => ({})
    : fadeUp;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-32 pb-24 lg:pt-20 lg:pb-8 overflow-hidden"
    >
      {/* Parallax background image */}
      {bgUrl ? (
        <>
          <motion.div
            className="absolute inset-0 z-0"
            style={shouldReduceMotion ? {} : { y: bgY }}
          >
            <Image
              src={contentfulImageUrl(bgUrl, 1920)}
              alt=""
              fill
              className="object-cover scale-110"
              priority
              unoptimized
            />
          </motion.div>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 z-[1] bg-[var(--color-bg)]/80" />
        </>
      ) : (
        <div className="absolute inset-0 z-0 bg-[var(--color-bg)]" />
      )}

      <div className="mx-auto max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        {/* Text content */}
        <div className="order-2 lg:order-1">
          {data.greeting && (
            <motion.p
              className="text-lg md:text-xl font-medium text-[var(--color-accent)] mb-2"
              {...anim(0)}
            >
              {data.greeting}
            </motion.p>
          )}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-[72px] font-extrabold leading-[1.15] tracking-tight mb-4 gradient-text pb-1 font-[family-name:var(--font-playfair)]"
            {...anim(0.2)}
          >
            {data.name}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl font-semibold text-[var(--color-text-secondary)] mb-6"
            {...anim(0.4)}
          >
            {data.title}
          </motion.p>
          {data.subtitle && (
            <motion.p
              className="text-base md:text-lg text-[var(--color-text-tertiary)] max-w-lg mb-8 leading-relaxed"
              {...anim(0.6)}
            >
              {data.subtitle}
            </motion.p>
          )}
          <motion.div className="flex flex-wrap gap-4" {...anim(0.8)}>
            <Button variant="primary" size="lg" href={data.ctaLink}>
              {data.ctaLabel}
            </Button>
            {data.secondaryCtaLabel && resumeUrl && (
              <Button variant="outline" size="lg" href={resumeUrl}>
                {data.secondaryCtaLabel}
              </Button>
            )}
          </motion.div>
        </div>

        {/* Profile photo — square with rounded corners */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          {photoUrl && (
            <motion.div
              className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[456px] lg:h-[456px]"
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Spinning gradient ring */}
              <div className="absolute -inset-2 rounded-2xl animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,var(--color-accent),var(--color-lavender),var(--color-accent))] opacity-30" />
              <div className="absolute -inset-2 rounded-2xl bg-[var(--color-bg)]/80 backdrop-blur-sm" style={{ margin: 3 }} />
              <Image
                src={contentfulImageUrl(photoUrl, 840)}
                alt={data.name}
                width={840}
                height={840}
                className="rounded-2xl object-cover w-full h-full relative z-10"
                priority
                unoptimized
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors cursor-pointer animate-scroll-bounce z-10"
        initial={shouldReduceMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} />
      </motion.a>
    </section>
  );
}

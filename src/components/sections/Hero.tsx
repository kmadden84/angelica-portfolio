"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ParallaxLayer } from "@/components/animations/ParallaxLayer";
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
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export function Hero({ data, resumeUrl }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  if (!data) return null;

  const photoUrl = getAssetUrl(data.profilePhoto);
  const anim = shouldReduceMotion
    ? () => ({})
    : fadeUp;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-20 overflow-hidden bg-[var(--color-bg)]"
    >
      {/* Decorative gradient blobs with parallax */}
      <ParallaxLayer speed={-0.2} className="absolute top-20 right-0 pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-[var(--color-accent)]/5 blur-3xl" />
      </ParallaxLayer>
      <ParallaxLayer speed={-0.15} className="absolute bottom-0 left-0 pointer-events-none">
        <div className="w-[400px] h-[400px] rounded-full bg-[var(--color-lavender)]/30 blur-3xl" />
      </ParallaxLayer>

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
            className="text-5xl md:text-6xl lg:text-[72px] font-extrabold leading-[1.15] tracking-tight mb-4 gradient-text pb-1"
            {...anim(0.2)}
          >
            {data.name}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl font-semibold text-[var(--color-text)]/70 mb-6"
            {...anim(0.4)}
          >
            {data.title}
          </motion.p>
          {data.subtitle && (
            <motion.p
              className="text-base md:text-lg text-[var(--color-text)]/60 max-w-lg mb-8 leading-relaxed"
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

        {/* Profile photo */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          {photoUrl && (
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px]"
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Spinning gradient ring */}
              <div className="absolute -inset-2 rounded-full animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,var(--color-accent),var(--color-lavender),var(--color-accent))] opacity-30" />
              <div className="absolute -inset-2 rounded-full bg-[var(--color-bg)]" style={{ margin: 3 }} />
              <Image
                src={contentfulImageUrl(photoUrl, 840)}
                alt={data.name}
                width={840}
                height={840}
                className="rounded-full object-cover w-full h-full relative z-10"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors cursor-pointer animate-scroll-bounce"
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

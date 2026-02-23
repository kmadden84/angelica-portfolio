"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
}

export function ParallaxImage({ src, alt, width, height, className, imageClassName }: ParallaxImageProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div ref={ref} className={`overflow-hidden rounded-2xl ${className || ""}`}>
      <motion.div className="h-full" style={shouldReduceMotion ? {} : { y }}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`w-full object-cover scale-110 ${imageClassName || ""}`}
          unoptimized
        />
      </motion.div>
    </div>
  );
}

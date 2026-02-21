"use client";

import { Linkedin, Youtube, Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  name?: string;
  email?: string;
  linkedinUrl?: string;
}

const socialLinks = [
  {
    href: "https://www.linkedin.com/in/angelicarockford/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://www.youtube.com/@angelicarockford",
    label: "YouTube",
    icon: Youtube,
  },
  {
    href: "https://www.instagram.com/angelicarockford/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://www.facebook.com/angelicarockfordchildrenbooks/",
    label: "Facebook",
    icon: Facebook,
  },
];

export function Footer({ name }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2D2D3E] text-white/45 px-6 md:px-12 lg:px-20 py-6 border-t border-white/5">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          {/* Left: contact info */}
          <div className="flex flex-col items-center md:items-start gap-1.5 text-xs">
            <p>
              &copy; {year} {name || "Portfolio"}. All rights reserved.
            </p>
            <a
              href="mailto:guzangelica971@gmail.com"
              className="flex items-center gap-1.5 hover:text-white/75 transition-colors"
            >
              <Mail className="w-3 h-3" />
              guzangelica971@gmail.com
            </a>
            <a
              href="tel:+16476139984"
              className="flex items-center gap-1.5 hover:text-white/75 transition-colors"
            >
              <Phone className="w-3 h-3" />
              647-613-9984
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              118 Montgomery Ave, M4R 1E3, Toronto
            </span>
          </div>

          {/* Right: social icons */}
          <div className="flex items-center gap-5">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/45 hover:text-white/75 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <p className="text-center text-[10px] text-white/20 mt-4 tracking-wide">
          Crafted with{" "}
          <span className="inline-block animate-pulse text-red-400/60">&#9829;</span>{" "}
          and a lot of coffee
        </p>
      </div>
    </footer>
  );
}

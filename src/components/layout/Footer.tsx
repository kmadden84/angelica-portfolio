"use client";

import { Linkedin, Youtube, Instagram, Facebook, Mail, MapPin } from "lucide-react";

interface FooterProps {
  name?: string;
  email?: string;
  linkedinUrl?: string;
  navItems?: { label: string; anchor: string }[];
  resumeUrl?: string;
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

export function Footer({ name, email, resumeUrl }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-darker)] px-6 md:px-12 lg:px-20 pt-12 pb-8">
      <div className="mx-auto max-w-6xl">
        {/* Two-column layout: brand left, social + CTA right */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-8 border-b border-white/10">
          {/* Left: brand */}
          <div className="flex flex-col items-center md:items-start">
            <a href="#hero" className="text-xl font-bold text-[var(--color-bg)] tracking-tight font-[family-name:var(--font-playfair)]">
              {name || "Portfolio"}
            </a>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-[var(--color-light-muted)]">
              <MapPin className="w-3.5 h-3.5" />
              <span>Based in Toronto</span>
            </div>
          </div>

          {/* Right: social icons + CTAs */}
          <div className="flex flex-col items-center md:items-end gap-5">
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-[var(--color-light-muted)] hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-bg)] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full border border-[var(--color-light-faint)] text-[var(--color-bg)] hover:bg-white/10 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Get In Touch
                </a>
              )}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
                >
                  Resume
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-xs text-[var(--color-light-faint)]">
            &copy; {year} {name || "Portfolio"}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-light-faint)] tracking-wide">
            Crafted with{" "}
            <span className="inline-block animate-pulse text-red-400/80">&#9829;</span>{" "}
            and a lot of coffee
          </p>
        </div>
      </div>
    </footer>
  );
}

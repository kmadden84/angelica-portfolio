"use client";

import { Linkedin, Youtube, Instagram, Facebook } from "lucide-react";

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

export function Footer({ name, email }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2D2D3E] text-white/45 px-6 md:px-12 lg:px-20 py-5 border-t border-white/5">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs">
            &copy; {year} {name || "Portfolio"}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-xs hover:text-white/75 transition-colors"
              >
                {email}
              </a>
            )}
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
        <p className="text-center text-[10px] text-white/20 mt-3 tracking-wide">
          Crafted with{" "}
          <span className="inline-block animate-pulse text-red-400/60">&#9829;</span>{" "}
          and a lot of coffee
        </p>
      </div>
    </footer>
  );
}

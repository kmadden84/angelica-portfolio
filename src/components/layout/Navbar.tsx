"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  label: string;
  anchor: string;
}

interface NavbarProps {
  items: NavItem[];
  siteName?: string;
  resumeUrl?: string;
}

export function Navbar({ items, siteName, resumeUrl }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[var(--color-bg)]/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-[var(--color-text)]/5"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 md:px-12 lg:px-20 h-16 md:h-20">
        <a
          href="#hero"
          className="text-lg font-bold tracking-tight text-[var(--color-text)]"
        >
          {siteName || "Portfolio"}
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {items.map((item) => (
            <li key={item.anchor}>
              <a
                href={item.anchor}
                className="text-sm font-medium text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
          {resumeUrl && (
            <li>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
              >
                Resume
              </a>
            </li>
          )}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[var(--color-text)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[var(--color-text)]/5">
          <ul className="flex flex-col px-6 py-6 gap-4">
            {items.map((item) => (
              <li key={item.anchor}>
                <a
                  href={item.anchor}
                  className="text-base font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {resumeUrl && (
              <li className="pt-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full bg-[var(--color-accent)] text-white"
                >
                  Resume
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

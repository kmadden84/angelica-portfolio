"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Split "Name | Subtitle" into two parts for responsive display
  const nameParts = (siteName || "Portfolio").split("|").map((s) => s.trim());
  const shortName = nameParts[0];
  const fullName = siteName || "Portfolio";

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
          className="text-lg font-bold tracking-tight text-[var(--color-text)] shrink-0 truncate max-w-[220px] sm:max-w-none"
        >
          <span className="sm:hidden">{shortName}</span>
          <span className="hidden sm:inline">{fullName}</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-4 xl:gap-8">
          {items.map((item) => (
            <li key={item.anchor}>
              <a
                href={item.anchor}
                className="text-sm font-medium text-[var(--color-text)]/70 hover:text-[var(--color-accent)] transition-colors whitespace-nowrap"
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

        {/* Mobile/tablet toggle */}
        <button
          className="lg:hidden p-2 text-[var(--color-text)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile/tablet menu with animation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-[var(--color-text)]/5 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <ul className="flex flex-col px-6 py-6 gap-4">
              {items.map((item, i) => (
                <motion.li
                  key={item.anchor}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                >
                  <a
                    href={item.anchor}
                    className="text-base font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
              {resumeUrl && (
                <motion.li
                  className="pt-2"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: items.length * 0.04 }}
                >
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded-full bg-[var(--color-accent)] text-white"
                  >
                    Resume
                  </a>
                </motion.li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

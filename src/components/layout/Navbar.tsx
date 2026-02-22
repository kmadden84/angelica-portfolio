"use client";

import { useState, useEffect, useRef } from "react";
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
  const [activeSection, setActiveSection] = useState("");

  const rafRef = useRef(0);

  useEffect(() => {
    const sectionIds = items.map((item) => item.anchor.replace("#", ""));

    const update = () => {
      setIsScrolled(window.scrollY > 50);

      // If scrolled to the very bottom, activate the last section
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (atBottom) {
        // Find the last nav section that exists in the DOM
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          if (document.getElementById(sectionIds[i])) {
            setActiveSection(`#${sectionIds[i]}`);
            return;
          }
        }
      }

      // Scroll-spy: find the section whose top is closest to (but above) 30% of viewport
      const trigger = window.innerHeight * 0.3;
      let current = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= trigger) current = `#${id}`;
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // run once on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [items]);

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
      <nav className="mx-auto max-w-6xl flex items-center justify-between gap-8 px-6 md:px-12 lg:px-20 h-16 md:h-20">
        <a
          href="#hero"
          className="text-lg font-bold tracking-tight text-[var(--color-text)] shrink-0"
        >
          <span className="sm:hidden">{shortName}</span>
          <span className="hidden sm:inline">{fullName}</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-4 xl:gap-8">
          {items.map((item) => {
            const isActive = activeSection === item.anchor;
            return (
              <li key={item.anchor}>
                <a
                  href={item.anchor}
                  className={cn(
                    "relative text-sm font-medium transition-colors whitespace-nowrap py-1",
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[var(--color-accent)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
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
            className="lg:hidden bg-[var(--color-bg)]/95 backdrop-blur-md border-t border-[var(--color-text)]/5 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ul className="flex flex-col px-6 py-6 gap-4">
              {items.map((item, i) => {
                const isActive = activeSection === item.anchor;
                return (
                  <motion.li
                    key={item.anchor}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.08 }}
                  >
                    <a
                      href={item.anchor}
                      className={cn(
                        "text-base font-medium transition-colors",
                        isActive
                          ? "text-[var(--color-accent)]"
                          : "text-[var(--color-text)] hover:text-[var(--color-accent)]"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileOpen(false);
                        const target = document.querySelector(item.anchor);
                        if (target) {
                          setTimeout(() => {
                            target.scrollIntoView({ behavior: "smooth" });
                          }, 300);
                        }
                      }}
                    >
                      {isActive && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mr-2 align-middle" />
                      )}
                      {item.label}
                    </a>
                  </motion.li>
                );
              })}
              {resumeUrl && (
                <motion.li
                  className="pt-2"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: items.length * 0.08 }}
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

"use client";

interface FooterProps {
  name?: string;
  email?: string;
  linkedinUrl?: string;
}

export function Footer({ name, email, linkedinUrl }: FooterProps) {
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
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:text-white/75 transition-colors"
              >
                LinkedIn
              </a>
            )}
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

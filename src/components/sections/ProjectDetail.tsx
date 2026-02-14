"use client";

import Image from "next/image";
import { X, ExternalLink, ArrowRight } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { RichText } from "@/components/ui/RichText";
import { contentfulImageUrl } from "@/lib/utils/constants";
import type { Project } from "@/types/contentful";
import type { Asset } from "contentful";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } })
    .fields?.file;
  return file?.url || "";
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const gallery = (project.gallery || []) as Asset[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Semi-opaque backdrop - background content visible */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Modal */}
      <div
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-md border-b border-[var(--color-text)]/5">
          <h2 className="text-xl md:text-2xl font-bold pr-8 truncate">
            {project.title}
          </h2>
          <div className="flex items-center gap-3 shrink-0">
            {project.externalLink && (
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-colors"
              >
                View Live <ExternalLink size={12} />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--color-text)]/5 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} className="text-[var(--color-text)]/50" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(85vh-72px)] px-8 py-6">
          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}

          {/* STAR Framework - card-based layout */}
          <div className="space-y-5">
            {/* Context & Objective side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[var(--color-bg)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text)]/40">
                    Context
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-text)]/70">
                  {project.context}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--color-bg)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text)]/40">
                    Objective
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-text)]/70">
                  {project.objective}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 px-5 py-4">
              <ArrowRight size={16} className="text-[var(--color-accent)] shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text)]/40">
                  My Role
                </span>
                <p className="text-sm font-semibold mt-0.5">{project.role}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl bg-[var(--color-bg)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text)]/40">
                  Actions Taken
                </h3>
              </div>
              <div className="text-sm leading-relaxed text-[var(--color-text)]/70 [&_ul]:space-y-2 [&_li]:text-sm">
                <RichText content={project.actions} />
              </div>
            </div>

            {/* Results */}
            <div className="rounded-2xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                  Results
                </h3>
              </div>
              <div className="text-sm leading-relaxed text-[var(--color-text)]/80 [&_ul]:space-y-2 [&_li]:text-sm font-medium">
                <RichText content={project.results} />
              </div>
            </div>
          </div>

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text)]/40 mb-4">
                Gallery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gallery.map((img, i) => {
                  const url = getAssetUrl(img);
                  if (!url) return null;
                  return (
                    <Image
                      key={i}
                      src={contentfulImageUrl(url, 600)}
                      alt={`${project.title} gallery ${i + 1}`}
                      width={600}
                      height={400}
                      className="rounded-xl w-full object-cover"
                      unoptimized
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

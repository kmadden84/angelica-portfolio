"use client";

import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { contentfulImageUrl } from "@/lib/utils/constants";
import type { Project } from "@/types/contentful";
import type { Asset } from "contentful";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function getAssetUrl(asset?: Asset): string {
  if (!asset) return "";
  const file = (asset as unknown as { fields: { file: { url: string } } }).fields?.file;
  return file?.url || "";
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const thumbUrl = getAssetUrl(project.thumbnail);

  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-2xl overflow-hidden bg-white border border-[var(--color-text)]/5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
    >
      {/* Thumbnail */}
      {thumbUrl && (
        <div className="aspect-video overflow-hidden">
          <Image
            src={contentfulImageUrl(thumbUrl, 640)}
            alt={project.title}
            width={640}
            height={360}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>
      )}

      <div className="p-5 md:p-6">
        <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--color-accent)] transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-[var(--color-text)]/60 line-clamp-2 mb-4">
          {project.context}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

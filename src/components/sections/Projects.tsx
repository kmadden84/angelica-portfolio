"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetail } from "./ProjectDetail";
import type { Project } from "@/types/contentful";

interface ProjectsProps {
  data: Project[];
  alt?: boolean;
}

export function Projects({ data, alt }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!data || data.length === 0) return null;

  const sorted = [...data].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.sortOrder - b.sortOrder;
  });

  return (
    <SectionWrapper id="projects" alt={alt}>
      <RevealOnScroll>
        <SectionHeading number="02" title="Projects" />
      </RevealOnScroll>

      <StaggerChildren
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sorted.map((project) => (
          <StaggerItem key={project.slug}>
            <ProjectCard
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          </StaggerItem>
        ))}
      </StaggerChildren>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selectedProject && (
              <ProjectDetail
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </SectionWrapper>
  );
}

"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { richTextOptions } from "@/lib/contentful/richTextOptions";
import { cn } from "@/lib/utils/cn";

interface RichTextProps {
  content: Document;
  className?: string;
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null;
  return (
    <div className={cn("prose prose-lg max-w-none", className)}>
      {documentToReactComponents(content, richTextOptions)}
    </div>
  );
}

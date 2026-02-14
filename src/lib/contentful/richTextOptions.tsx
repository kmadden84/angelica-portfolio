import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import type { Options } from "@contentful/rich-text-react-renderer";
import type { ReactNode } from "react";
import Image from "next/image";
import { contentfulImageUrl } from "@/lib/utils/constants";

/**
 * Contentful wraps every list-item's text in a <p> tag.
 * This strips the outer <p> so bullets render inline with text.
 */
function unwrapParagraph(children: ReactNode): ReactNode {
  if (!Array.isArray(children)) return children;
  return children.map((child) => {
    if (
      child &&
      typeof child === "object" &&
      "type" in child &&
      child.type === "p"
    ) {
      return child.props.children;
    }
    return child;
  });
}

export const richTextOptions: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong className="font-semibold">{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => (
      <p className="mb-4 last:mb-0">{children}</p>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="text-xl font-semibold mb-2 mt-6">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (_node, children) => (
      <h4 className="text-lg font-semibold mb-2 mt-4">{children}</h4>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="list-disc pl-5 mb-4 space-y-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="list-decimal pl-5 mb-4 space-y-2">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node, children) => (
      <li className="leading-relaxed pl-1">
        {unwrapParagraph(children)}
      </li>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const { file, title } = node.data.target.fields;
      if (!file?.url) return null;
      return (
        <div className="my-6">
          <Image
            src={contentfulImageUrl(file.url, 800)}
            alt={title || ""}
            width={800}
            height={450}
            className="rounded-lg w-full"
            unoptimized
          />
        </div>
      );
    },
    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        {children}
      </a>
    ),
  },
};

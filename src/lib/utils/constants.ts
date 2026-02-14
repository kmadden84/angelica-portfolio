export const SECTION_IDS = {
  hero: "hero",
  about: "about",
  projects: "projects",
  strengths: "strengths",
  experience: "experience",
  education: "education",
  leadership: "leadership",
  tools: "tools",
  contact: "contact",
} as const;

export const CONTENTFUL_IMAGE_PARAMS = "?fm=webp&q=80";

export function contentfulImageUrl(url: string, width?: number): string {
  if (!url) return "";
  const base = url.startsWith("//") ? `https:${url}` : url;
  const params = new URLSearchParams();
  if (width) params.set("w", String(width));
  params.set("fm", "webp");
  params.set("q", "80");
  return `${base}?${params.toString()}`;
}

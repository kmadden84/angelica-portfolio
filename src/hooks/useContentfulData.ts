"use client";

import { useState, useEffect } from "react";
import { createClient } from "contentful";
import type { PageData } from "@/app/page";

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master",
});

async function fetchAllPageData(): Promise<PageData> {
  const [
    siteSettingsRes,
    heroRes,
    aboutRes,
    projectsRes,
    strengthsRes,
    toolsRes,
    educationRes,
    leadershipRes,
    contactRes,
    navigationRes,
  ] = await Promise.all([
    client.getEntries({ content_type: "siteSettings", limit: 1, include: 2 }),
    client.getEntries({ content_type: "heroSection", limit: 1, include: 2 }),
    client.getEntries({ content_type: "aboutSection", limit: 1, include: 2 }),
    client.getEntries({ content_type: "project", order: ["fields.sortOrder"], include: 2 }),
    client.getEntries({ content_type: "skillCategory", "fields.section": "strengths", order: ["fields.sortOrder"], include: 2 }),
    client.getEntries({ content_type: "skillCategory", "fields.section": "tools", order: ["fields.sortOrder"], include: 2 }),
    client.getEntries({ content_type: "education", order: ["fields.sortOrder"], include: 2 }),
    client.getEntries({ content_type: "leadershipActivity", order: ["fields.sortOrder"], include: 2 }),
    client.getEntries({ content_type: "contactSection", limit: 1, include: 2 }),
    client.getEntries({ content_type: "navigationItem", order: ["fields.sortOrder"], include: 2 }),
  ]);

  return {
    siteSettings: (siteSettingsRes.items[0] ?? null) as unknown as PageData["siteSettings"],
    hero: (heroRes.items[0] ?? null) as unknown as PageData["hero"],
    about: (aboutRes.items[0] ?? null) as unknown as PageData["about"],
    projects: projectsRes.items as unknown as PageData["projects"],
    strengths: strengthsRes.items as unknown as PageData["strengths"],
    tools: toolsRes.items as unknown as PageData["tools"],
    education: educationRes.items as unknown as PageData["education"],
    leadership: leadershipRes.items as unknown as PageData["leadership"],
    contact: (contactRes.items[0] ?? null) as unknown as PageData["contact"],
    navigation: navigationRes.items as unknown as PageData["navigation"],
  };
}

export function useContentfulData(initialData: PageData) {
  const [data, setData] = useState<PageData>(initialData);

  useEffect(() => {
    // Fetch fresh data client-side on every page load
    fetchAllPageData()
      .then(setData)
      .catch((err) => console.warn("Failed to fetch fresh Contentful data:", err));
  }, []);

  return data;
}

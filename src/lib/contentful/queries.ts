import { getContentfulClient } from "./client";
import type {
  SiteSettingsSkeleton,
  HeroSectionSkeleton,
  AboutSectionSkeleton,
  ProjectSkeleton,
  SkillCategorySkeleton,
  EducationSkeleton,
  LeadershipActivitySkeleton,
  ContactSectionSkeleton,
  NavigationItemSkeleton,
} from "@/types/contentful";
import type { Entry, EntrySkeletonType } from "contentful";

async function getSingleton<T extends EntrySkeletonType>(
  contentType: string
): Promise<Entry<T, undefined, string> | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = await getContentfulClient().getEntries<T>({
      content_type: contentType,
      limit: 1,
      include: 2,
    } as any);
    return entries.items[0] ?? null;
  } catch {
    console.warn(`Failed to fetch ${contentType}`);
    return null;
  }
}

async function getCollection<T extends EntrySkeletonType>(
  contentType: string
): Promise<Entry<T, undefined, string>[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = await getContentfulClient().getEntries<T>({
      content_type: contentType,
      order: ["fields.sortOrder"],
      include: 2,
    } as any);
    return entries.items;
  } catch {
    console.warn(`Failed to fetch ${contentType}`);
    return [];
  }
}

export async function getSiteSettings() {
  return getSingleton<SiteSettingsSkeleton>("siteSettings");
}

export async function getHeroSection() {
  return getSingleton<HeroSectionSkeleton>("heroSection");
}

export async function getAboutSection() {
  return getSingleton<AboutSectionSkeleton>("aboutSection");
}

export async function getProjects() {
  return getCollection<ProjectSkeleton>("project");
}

export async function getSkillCategories(section?: "strengths" | "tools") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      content_type: "skillCategory",
      order: ["fields.sortOrder"],
      include: 2,
    };
    if (section) {
      query["fields.section"] = section;
    }
    const entries =
      await getContentfulClient().getEntries<SkillCategorySkeleton>(query);
    return entries.items;
  } catch {
    console.warn("Failed to fetch skillCategories");
    return [];
  }
}

export async function getEducation() {
  return getCollection<EducationSkeleton>("education");
}

export async function getLeadershipActivities() {
  return getCollection<LeadershipActivitySkeleton>("leadershipActivity");
}

export async function getContactSection() {
  return getSingleton<ContactSectionSkeleton>("contactSection");
}

export async function getNavigationItems() {
  return getCollection<NavigationItemSkeleton>("navigationItem");
}

export async function getAllPageData() {
  const [
    siteSettings,
    hero,
    about,
    projects,
    strengths,
    tools,
    education,
    leadership,
    contact,
    navigation,
  ] = await Promise.all([
    getSiteSettings(),
    getHeroSection(),
    getAboutSection(),
    getProjects(),
    getSkillCategories("strengths"),
    getSkillCategories("tools"),
    getEducation(),
    getLeadershipActivities(),
    getContactSection(),
    getNavigationItems(),
  ]);

  return {
    siteSettings,
    hero,
    about,
    projects,
    strengths,
    tools,
    education,
    leadership,
    contact,
    navigation,
  };
}

import type { Document } from "@contentful/rich-text-types";
import type { Asset, EntrySkeletonType, Entry } from "contentful";

// Skeleton types for Contentful v10+ SDK
export interface SiteSettingsSkeleton extends EntrySkeletonType {
  contentTypeId: "siteSettings";
  fields: {
    siteTitle: string;
    siteDescription: string;
    ogImage?: Asset;
    favicon?: Asset;
    resumePdf?: Asset;
    primaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    navyColor?: string;
    lavenderColor?: string;
  };
}

export interface HeroSectionSkeleton extends EntrySkeletonType {
  contentTypeId: "heroSection";
  fields: {
    greeting: string;
    name: string;
    title: string;
    subtitle?: string;
    ctaLabel: string;
    ctaLink: string;
    secondaryCtaLabel?: string;
    profilePhoto: Asset;
    backgroundMedia?: Asset;
  };
}

export interface AboutSectionSkeleton extends EntrySkeletonType {
  contentTypeId: "aboutSection";
  fields: {
    heading: string;
    bio: Document;
    photo?: Asset;
    highlights?: { label: string; value: string }[];
  };
}

export interface ProjectSkeleton extends EntrySkeletonType {
  contentTypeId: "project";
  fields: {
    title: string;
    slug: string;
    context: string;
    objective: string;
    role: string;
    actions: Document;
    results: Document;
    thumbnail: Asset;
    gallery?: Asset[];
    tags?: string[];
    featured?: boolean;
    externalLink?: string;
    sortOrder: number;
  };
}

export interface SkillCategorySkeleton extends EntrySkeletonType {
  contentTypeId: "skillCategory";
  fields: {
    categoryName: string;
    section: "strengths" | "tools";
    skills: { name: string; icon?: string; proficiency?: number }[];
    sortOrder: number;
    displayStyle?: "bento-large" | "bento-medium" | "bento-small";
  };
}

export interface ExperienceSkeleton extends EntrySkeletonType {
  contentTypeId: "experience";
  fields: {
    jobTitle: string;
    company: string;
    companyLogo?: Asset;
    dateRange: string;
    description?: Document;
    tags?: string[];
    sortOrder: number;
  };
}

export interface EducationSkeleton extends EntrySkeletonType {
  contentTypeId: "education";
  fields: {
    program: string;
    institution: string;
    institutionLogo?: Asset;
    dateRange: string;
    focusAreas?: string[];
    description?: Document;
    sortOrder: number;
  };
}

export interface LeadershipActivitySkeleton extends EntrySkeletonType {
  contentTypeId: "leadershipActivity";
  fields: {
    title: string;
    organization?: string;
    dateRange?: string;
    description: Document;
    image?: Asset;
    sortOrder: number;
  };
}

export interface ContactSectionSkeleton extends EntrySkeletonType {
  contentTypeId: "contactSection";
  fields: {
    heading: string;
    subheading?: string;
    email: string;
    linkedinUrl?: string;
    location?: string;
    additionalLinks?: { label: string; url: string; icon?: string }[];
  };
}

export interface NavigationItemSkeleton extends EntrySkeletonType {
  contentTypeId: "navigationItem";
  fields: {
    label: string;
    anchor: string;
    sortOrder: number;
  };
}

// Convenience field type aliases (what you get from entry.fields)
export type SiteSettings = SiteSettingsSkeleton["fields"];
export type HeroSection = HeroSectionSkeleton["fields"];
export type AboutSection = AboutSectionSkeleton["fields"];
export type Project = ProjectSkeleton["fields"];
export type SkillCategory = SkillCategorySkeleton["fields"];
export type Experience = ExperienceSkeleton["fields"];
export type Education = EducationSkeleton["fields"];
export type LeadershipActivity = LeadershipActivitySkeleton["fields"];
export type ContactSection = ContactSectionSkeleton["fields"];
export type NavigationItem = NavigationItemSkeleton["fields"];

"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Strengths } from "@/components/sections/Strengths";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Leadership } from "@/components/sections/Leadership";
import { NetworkEvents } from "@/components/sections/NetworkEvents";
import { Tools } from "@/components/sections/Tools";
import { Contact } from "@/components/sections/Contact";
import { GsapProvider } from "@/components/animations/GsapProvider";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { useContentfulData } from "@/hooks/useContentfulData";
import type { PageData } from "@/app/page";

export function ClientPage({ data: initialData }: { data: PageData }) {
  // Build-time data renders instantly; fresh Contentful data swaps in on load
  const data = useContentfulData(initialData);

  const {
    siteSettings,
    hero,
    about,
    projects,
    strengths,
    tools,
    experience,
    education,
    leadership,
    networkEvents,
    contact,
    navigation,
  } = data;

  // Extract fields from Contentful entries
  const navItems = navigation.map((n) => {
    const f = n.fields as unknown as { label: string; anchor: string };
    return { label: f.label, anchor: f.anchor };
  });

  const siteFields = siteSettings?.fields as unknown as {
    resumePdf?: { fields: { file: { url: string } } };
    primaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    navyColor?: string;
    lavenderColor?: string;
  } | null;

  const resumeUrl = siteFields?.resumePdf?.fields?.file?.url
    ? `https:${siteFields.resumePdf.fields.file.url}`
    : undefined;

  // Apply dynamic colors from Contentful (overrides CSS fallbacks)
  const style: React.CSSProperties = {};
  const s = style as Record<string, string>;
  if (siteFields?.primaryColor) {
    s["--color-primary"] = siteFields.primaryColor;
    s["--color-text"] = siteFields.primaryColor;
  }
  if (siteFields?.accentColor) {
    s["--color-accent-dynamic"] = siteFields.accentColor;
    s["--color-accent"] = siteFields.accentColor;
  }
  if (siteFields?.backgroundColor) {
    s["--color-bg"] = siteFields.backgroundColor;
  }
  if (siteFields?.navyColor) {
    s["--color-navy"] = siteFields.navyColor;
  }
  if (siteFields?.lavenderColor) {
    s["--color-lavender"] = siteFields.lavenderColor;
  }

  const heroFields = hero?.fields as unknown as import("@/types/contentful").HeroSection | null;
  const aboutFields = about?.fields as unknown as import("@/types/contentful").AboutSection | null;
  const contactFields = contact?.fields as unknown as import("@/types/contentful").ContactSection | null;

  const projectFields = projects.map(
    (p) => p.fields as unknown as import("@/types/contentful").Project
  );
  const strengthFields = strengths.map(
    (s) => s.fields as unknown as import("@/types/contentful").SkillCategory
  );
  const toolFields = tools.map(
    (t) => t.fields as unknown as import("@/types/contentful").SkillCategory
  );
  const expFields = experience.map(
    (e) => e.fields as unknown as import("@/types/contentful").Experience
  );
  const eduFields = education.map(
    (e) => e.fields as unknown as import("@/types/contentful").Education
  );
  const leaderFields = leadership.map(
    (l) => l.fields as unknown as import("@/types/contentful").LeadershipActivity
  );
  const networkEventsFields = networkEvents?.fields as unknown as import("@/types/contentful").NetworkEventsSection | null;

  return (
    <GsapProvider>
    <div style={style} className="bg-noise">
      <ScrollProgress />
      <Navbar
        items={navItems}
        siteName={
          (siteSettings?.fields as unknown as { siteTitle?: string })?.siteTitle
        }
        resumeUrl={resumeUrl}
      />

      <main>
        <Hero data={heroFields} resumeUrl={resumeUrl} />
        <About data={aboutFields} alt />
        <Projects data={projectFields} />
        <Strengths data={strengthFields} alt />
        <Experience data={expFields} />
        <Education data={eduFields} alt />
        <Leadership data={leaderFields} />
        <NetworkEvents data={networkEventsFields} alt />
        <Tools data={toolFields} />
        <WaveDivider variant="to-dark" />
        <Contact data={contactFields} />
      </main>

      <Footer
        name={heroFields?.name}
        email={contactFields?.email}
        linkedinUrl={contactFields?.linkedinUrl}
        navItems={navItems}
        resumeUrl={resumeUrl}
      />
    </div>
    </GsapProvider>
  );
}

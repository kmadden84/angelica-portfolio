/**
 * Apply professor feedback: update all Contentful entries to match
 * the feedback document's copy, categories, and experience entries.
 *
 * Run: node scripts/apply-professor-feedback.mjs
 */

import contentfulManagement from "contentful-management";
import { config } from "dotenv";

config({ path: ".env.local" });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || "master";

const client = contentfulManagement.createClient({
  accessToken: MANAGEMENT_TOKEN,
});

async function getEnvironment() {
  const space = await client.getSpace(SPACE_ID);
  return space.getEnvironment(ENVIRONMENT_ID);
}

function richText(...paragraphs) {
  return {
    nodeType: "document",
    data: {},
    content: paragraphs.map((text) => ({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: text, marks: [], data: {} }],
    })),
  };
}

function richTextWithBullets(intro, bullets, outro) {
  const content = [];
  if (intro) {
    content.push({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: intro, marks: [], data: {} }],
    });
  }
  content.push({
    nodeType: "unordered-list",
    data: {},
    content: bullets.map((b) => ({
      nodeType: "list-item",
      data: {},
      content: [
        {
          nodeType: "paragraph",
          data: {},
          content: [{ nodeType: "text", value: b, marks: [], data: {} }],
        },
      ],
    })),
  });
  if (outro) {
    content.push({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: outro, marks: [], data: {} }],
    });
  }
  return { nodeType: "document", data: {}, content };
}

async function updateEntry(env, contentType, fieldUpdates) {
  const entries = await env.getEntries({ content_type: contentType });
  if (entries.items.length === 0) {
    console.log(`  ⚠ No ${contentType} entries found`);
    return;
  }
  for (const entry of entries.items) {
    for (const [key, value] of Object.entries(fieldUpdates)) {
      entry.fields[key] = { "en-US": value };
    }
    const updated = await entry.update();
    await updated.publish();
    const title =
      entry.fields.siteTitle?.["en-US"] ||
      entry.fields.name?.["en-US"] ||
      entry.fields.heading?.["en-US"] ||
      entry.fields.title?.["en-US"] ||
      entry.fields.categoryName?.["en-US"] ||
      entry.fields.program?.["en-US"] ||
      entry.fields.label?.["en-US"] ||
      contentType;
    console.log(`  ✓ ${contentType}: "${title}"`);
  }
}

async function deleteAllEntries(env, contentType) {
  const entries = await env.getEntries({ content_type: contentType, limit: 100 });
  for (const entry of entries.items) {
    try {
      if (entry.sys.publishedVersion) await entry.unpublish();
      await entry.delete();
    } catch (err) {
      console.log(`  ⚠ Could not delete ${contentType}: ${err.message}`);
    }
  }
  console.log(`  ✓ Deleted ${entries.items.length} old ${contentType} entries`);
  return entries;
}

async function main() {
  console.log("📝 Applying professor feedback updates...\n");
  const env = await getEnvironment();

  // ──────────────────────────────────────────────────────────────
  // 1. HERO SECTION – update subtitle/intro text
  // ──────────────────────────────────────────────────────────────
  console.log("── Hero Section ──");
  await updateEntry(env, "heroSection", {
    title: "Marketing & Business Strategist",
    subtitle:
      "Marketing and Business Administration student at George Brown College with experience in advertising, digital marketing, sales, and retail environments. Background includes high-pressure industries such as cruise tourism, luxury retail, and digital advertising, with hands-on experience in account management, campaign optimization, and client relationship management at X (formerly Twitter).",
  });

  // ──────────────────────────────────────────────────────────────
  // 2. ABOUT SECTION – update bio to match doc
  // ──────────────────────────────────────────────────────────────
  console.log("\n── About Section ──");
  await updateEntry(env, "aboutSection", {
    heading: "About Me",
    bio: richText(
      "Hi, my name is Angelica. I\u2019m a Marketing and Business Administration student at George Brown College with professional experience in advertising, sales, customer service, and retail-focused environments.",
      "My work experience spans international cruise operations, luxury retail, and digital advertising, where I developed strong capabilities in client relationship management, sales strategy, campaign performance analysis, and customer engagement.",
      "I am also active in public speaking through Toastmasters and currently a candidate for President (2026), where I continue strengthening my leadership and professional communication skills.",
      "My career goal is to build a career in sales and brand partnerships within fashion retail and performance apparel, working with clothing and lifestyle brands such as Zara, Aritzia, COS, Massimo Dutti, Uniqlo, Canada Goose, Arc\u2019teryx, Moncler, and Moose Knuckles.",
      "In addition, I use writing and storytelling to support brand messaging, content strategy, and audience engagement."
    ),
  });

  // ──────────────────────────────────────────────────────────────
  // 3. CONTACT SECTION – update email per doc header
  // ──────────────────────────────────────────────────────────────
  console.log("\n── Contact Section ──");
  await updateEntry(env, "contactSection", {
    email: "Rockangelica333@gmail.com",
    location: "Toronto, Canada",
  });

  // ──────────────────────────────────────────────────────────────
  // 4. SKILL CATEGORIES – delete all, recreate per doc
  // ──────────────────────────────────────────────────────────────
  console.log("\n── Skill Categories (Core Competencies + Tools) ──");
  await deleteAllEntries(env, "skillCategory");

  const skillCategories = [
    // ── Core Competencies (strengths section) ──
    {
      categoryName: "Brand & Retail Marketing",
      section: "strengths",
      skills: [
        { name: "Visual Merchandising", icon: "Eye" },
        { name: "Brand Storytelling", icon: "PenTool" },
        { name: "Customer Experience", icon: "Heart" },
        { name: "Luxury Retail", icon: "Star" },
      ],
      sortOrder: 1,
      displayStyle: "bento-large",
    },
    {
      categoryName: "Digital Marketing",
      section: "strengths",
      skills: [
        { name: "Affiliate Marketing", icon: "Share2" },
        { name: "Multi-Channel Campaigns", icon: "Layout" },
        { name: "SEO", icon: "Search" },
        { name: "Content Marketing", icon: "FileText" },
        { name: "Marketing Analytics", icon: "BarChart3" },
      ],
      sortOrder: 2,
      displayStyle: "bento-large",
    },
    {
      categoryName: "Advertising & Paid Media",
      section: "strengths",
      skills: [
        { name: "Digital Advertising", icon: "Megaphone" },
        { name: "Audience Targeting", icon: "Target" },
        { name: "Campaign Optimization", icon: "TrendingUp" },
        { name: "ROI Strategy", icon: "DollarSign" },
      ],
      sortOrder: 3,
      displayStyle: "bento-medium",
    },
    {
      categoryName: "Leadership & Operations",
      section: "strengths",
      skills: [
        { name: "Team Leadership", icon: "Users" },
        { name: "KPI Management", icon: "BarChart3" },
        { name: "Cross-Functional Collaboration", icon: "GitMerge" },
        { name: "Performance Coaching", icon: "Award" },
      ],
      sortOrder: 4,
      displayStyle: "bento-medium",
    },
    {
      categoryName: "Adaptability & Problem-Solving",
      section: "strengths",
      skills: [
        { name: "Fast Learning & Adaptability", icon: "Compass" },
        { name: "Creative Problem-Solving", icon: "Lightbulb" },
        { name: "Decision-Making Under Pressure", icon: "Zap" },
      ],
      sortOrder: 5,
      displayStyle: "bento-small",
    },
    {
      categoryName: "Leadership & Team Collaboration",
      section: "strengths",
      skills: [
        { name: "Team Motivation & Mentoring", icon: "Users" },
        { name: "Public Speaking (Toastmasters)", icon: "Mic" },
        { name: "Empathy & Emotional Intelligence", icon: "Heart" },
      ],
      sortOrder: 6,
      displayStyle: "bento-small",
    },
    // ── Tools & Technology section ──
    {
      categoryName: "Tools & Technology",
      section: "tools",
      skills: [
        { name: "CRM", icon: "Database" },
        { name: "Marketing Analytics", icon: "BarChart3" },
        { name: "GA4", icon: "TrendingUp" },
        { name: "Canva", icon: "Palette" },
        { name: "Social Media Platforms", icon: "Share2" },
      ],
      sortOrder: 1,
      displayStyle: "bento-large",
    },
  ];

  for (const cat of skillCategories) {
    try {
      const entry = await env.createEntry("skillCategory", {
        fields: {
          categoryName: { "en-US": cat.categoryName },
          section: { "en-US": cat.section },
          skills: { "en-US": cat.skills },
          sortOrder: { "en-US": cat.sortOrder },
          displayStyle: { "en-US": cat.displayStyle },
        },
      });
      await entry.publish();
      console.log(`  ✓ skillCategory: "${cat.categoryName}"`);
    } catch (err) {
      console.log(`  ⚠ skillCategory "${cat.categoryName}": ${err.message}`);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 5. EXPERIENCE – delete all, recreate 6 entries per doc
  // ──────────────────────────────────────────────────────────────
  console.log("\n── Experience ──");
  await deleteAllEntries(env, "experience");

  const experiences = [
    {
      jobTitle: "Sales & Marketing Specialist",
      company: "BetterHelp",
      dateRange: "2024 \u2013 2025 \u00B7 Part-time",
      description: richTextWithBullets(null, [
        "Increased client conversions by 35% through targeted affiliate marketing strategies and personalized product recommendations.",
        "Expanded digital reach 40% using multi-channel campaigns (social media, email, referrals, and blog content).",
        "Generated 15,000+ blog views through SEO-optimized content promoting mental health products and books.",
        "Improved revenue 20% in six months by optimizing affiliate offerings and marketing strategies.",
        "Maintained 95% client satisfaction by delivering personalized support and resolving customer pain points.",
      ], null),
      tags: ["Affiliate Marketing", "SEO", "Content Marketing", "Multi-Channel Campaigns"],
      sortOrder: 1,
    },
    {
      jobTitle: "B2B Account Manager \u2013 X Ads (Twitter)",
      company: "Teleperformance",
      dateRange: "2024 \u2013 2025",
      description: richTextWithBullets(null, [
        "Managed onboarding and campaign setup for advertising clients, including Shopify pixel installation and ad account configuration.",
        "Led a team of 8 sales professionals, conducting KPI reviews and strategy meetings to exceed performance targets.",
        "Increased client account growth 20%+ through strategic upselling and cross-selling of X Ads marketing solutions.",
        "Analyzed campaign data to improve ROI, audience targeting, and client retention.",
        "Prospected new business and delivered consultative sales presentations, identifying client pain points and recommending high-performing ad placements.",
        "Conducted live platform demonstrations showcasing AI-powered campaign automation, audience targeting, and creative optimization tools.",
        "Collaborated with Customer Success and marketing teams to refine creative strategy and messaging based on campaign insights.",
        "Built long-term client relationships through transparent communication, strategic consultation, and personalized campaign planning.",
        "Designed custom campaign structures aligned with business objectives to drive measurable engagement and growth.",
        "Utilized CRM and analytics tools to track KPIs, monitor account performance, and refine campaign strategies using X Ads data insights.",
      ], null),
      tags: ["B2B Sales", "Account Management", "Team Leadership", "X Ads", "CRM"],
      sortOrder: 2,
    },
    {
      jobTitle: "Sales & Marketing Specialist \u2013 Freelancer",
      company: "Self-Employed (Fiverr / Upwork)",
      dateRange: "2022 \u2013 2023 \u00B7 Part-time",
      description: richTextWithBullets(null, [
        "Conducted SEO audits and optimization strategies to improve website visibility, keyword performance, and search rankings.",
        "Designed marketing visuals using Canva for social media, email campaigns, and promotional content to strengthen brand consistency.",
        "Developed content marketing strategies and blog articles in the mental health, psychology, and business niches.",
        "Performed marketing research, campaign analysis, and social media monitoring to guide strategic decisions.",
        "Assisted with UA/GA4 analytics implementation and campaign tracking.",
      ], null),
      tags: ["SEO", "Content Writing", "Canva", "GA4", "Freelance"],
      sortOrder: 3,
    },
    {
      jobTitle: "Social Media Marketing Freelancer",
      company: "Scope Media, Toronto / Health-Secret Fitness",
      dateRange: "2021 \u2013 2023 \u00B7 Part-time",
      description: richTextWithBullets(null, [
        "Developed brand management and content strategies for startups, mental health professionals, and small businesses.",
        "Implemented SEO improvements and audience segmentation to refine target markets and messaging.",
        "Created visual content and marketing materials using Canva to strengthen social media presence.",
        "Produced blog articles and educational content on mental health topics to build brand credibility.",
        "Provided brand storytelling and marketing consultation to help businesses communicate their value proposition.",
        "Published children\u2019s books in the mental health niche (Angelica Rockford Books \u2013 Amazon).",
      ], null),
      tags: ["Social Media", "Brand Management", "SEO", "Content Strategy", "Canva"],
      sortOrder: 4,
    },
    {
      jobTitle: "Shore Excursion Sales Specialist / Manager Assistant",
      company: "Norwegian Cruise Line",
      dateRange: "2014 \u2013 2020",
      description: richTextWithBullets(null, [
        "Promoted to Manager Assistant, leading a multicultural team and supporting sales operations.",
        "Generated 60\u201370 daily sales by presenting tailored excursion recommendations to 200+ guests.",
        "Increased onboard revenue through strategic upselling and cross-selling of excursions and VIP experiences.",
        "Delivered large-group presentations and safety briefings that improved booking conversions.",
        "Collaborated with vendors and tour operators to maintain high-quality service delivery and unique guest experiences.",
        "Awarded Team Inspiration Award (2020) and Outstanding Customer Service & Problem Resolution (2019).",
      ], null),
      tags: ["Sales", "Team Leadership", "Customer Service", "Upselling", "Presentations"],
      sortOrder: 5,
    },
    {
      jobTitle: "Sales and Operations Manager",
      company: "Luxury Clothing Store & Travel \u2013 Peru",
      dateRange: "2011 \u2013 2014",
      description: richTextWithBullets(null, [
        "Managed sales operations, customer experience, and daily business activities for a luxury fashion and travel enterprise.",
        "Oversaw inventory management, merchandising, and vendor coordination to support store performance and revenue growth.",
        "Delivered personalized service to luxury clientele, strengthening customer loyalty and repeat purchases.",
      ], null),
      tags: ["Sales Management", "Luxury Retail", "Operations", "Merchandising"],
      sortOrder: 6,
    },
  ];

  for (const exp of experiences) {
    try {
      const entry = await env.createEntry("experience", {
        fields: {
          jobTitle: { "en-US": exp.jobTitle },
          company: { "en-US": exp.company },
          dateRange: { "en-US": exp.dateRange },
          description: { "en-US": exp.description },
          tags: { "en-US": exp.tags },
          sortOrder: { "en-US": exp.sortOrder },
        },
      });
      await entry.publish();
      console.log(`  ✓ experience: "${exp.jobTitle} | ${exp.company}"`);
    } catch (err) {
      console.log(`  ⚠ experience "${exp.jobTitle}": ${err.message}`);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // 6. NAVIGATION – update anchors for new section order
  // ──────────────────────────────────────────────────────────────
  console.log("\n── Navigation ──");
  await deleteAllEntries(env, "navigationItem");

  const navItems = [
    { label: "About", anchor: "#about", sortOrder: 1 },
    { label: "Projects", anchor: "#projects", sortOrder: 2 },
    { label: "Education", anchor: "#education", sortOrder: 3 },
    { label: "Skills", anchor: "#strengths", sortOrder: 4 },
    { label: "Tools", anchor: "#tools", sortOrder: 5 },
    { label: "Experience", anchor: "#experience", sortOrder: 6 },
    { label: "Leadership", anchor: "#leadership", sortOrder: 7 },
    { label: "Contact", anchor: "#contact", sortOrder: 8 },
  ];

  for (const nav of navItems) {
    try {
      const entry = await env.createEntry("navigationItem", {
        fields: {
          label: { "en-US": nav.label },
          anchor: { "en-US": nav.anchor },
          sortOrder: { "en-US": nav.sortOrder },
        },
      });
      await entry.publish();
      console.log(`  ✓ nav: "${nav.label}" → ${nav.anchor}`);
    } catch (err) {
      console.log(`  ⚠ nav "${nav.label}": ${err.message}`);
    }
  }

  console.log("\n🎉 All professor feedback changes applied!");
}

main().catch((err) => {
  console.error("❌ Failed:", err.message || err);
  process.exit(1);
});

/**
 * Contentful Content Model Setup Script
 *
 * Creates all 9 content types and sample entries for the portfolio site.
 * Run once: node scripts/setup-contentful.mjs
 *
 * Requires env vars: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN
 */

import contentfulManagement from "contentful-management";
import { config } from "dotenv";

config({ path: ".env.local" });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || "master";

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error(
    "❌ CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be set in .env.local"
  );
  process.exit(1);
}

const client = contentfulManagement.createClient({
  accessToken: MANAGEMENT_TOKEN,
});

async function getEnvironment() {
  const space = await client.getSpace(SPACE_ID);
  return space.getEnvironment(ENVIRONMENT_ID);
}

async function createOrUpdateContentType(env, id, data) {
  let ct;
  try {
    ct = await env.getContentType(id);
    console.log(`  ⟳ Updating "${id}"...`);
    ct.name = data.name;
    ct.description = data.description || "";
    ct.displayField = data.displayField;
    ct.fields = data.fields;
    ct = await ct.update();
  } catch {
    console.log(`  + Creating "${id}"...`);
    ct = await env.createContentTypeWithId(id, {
      name: data.name,
      description: data.description || "",
      displayField: data.displayField,
      fields: data.fields,
    });
  }
  await ct.publish();
  console.log(`  ✓ "${id}" published`);
  return ct;
}

// ─── Content Type Definitions ────────────────────────────────────────

const contentTypes = [
  {
    id: "siteSettings",
    name: "Site Settings",
    description: "Global site configuration (singleton)",
    displayField: "siteTitle",
    fields: [
      { id: "siteTitle", name: "Site Title", type: "Symbol", required: true },
      {
        id: "siteDescription",
        name: "Site Description",
        type: "Text",
        required: true,
      },
      {
        id: "ogImage",
        name: "OG Image",
        type: "Link",
        linkType: "Asset",
        required: false,
      },
      {
        id: "favicon",
        name: "Favicon",
        type: "Link",
        linkType: "Asset",
        required: false,
      },
      {
        id: "resumePdf",
        name: "Resume PDF",
        type: "Link",
        linkType: "Asset",
        required: false,
      },
      {
        id: "primaryColor",
        name: "Primary Color",
        type: "Symbol",
        required: false,
        validations: [{ regexp: { pattern: "^#[0-9A-Fa-f]{6}$" } }],
      },
      {
        id: "accentColor",
        name: "Accent Color",
        type: "Symbol",
        required: false,
        validations: [{ regexp: { pattern: "^#[0-9A-Fa-f]{6}$" } }],
      },
    ],
  },
  {
    id: "heroSection",
    name: "Hero Section",
    description: "Landing hero content (singleton)",
    displayField: "name",
    fields: [
      { id: "greeting", name: "Greeting", type: "Symbol", required: false },
      { id: "name", name: "Name", type: "Symbol", required: true },
      { id: "title", name: "Title", type: "Symbol", required: true },
      { id: "subtitle", name: "Subtitle", type: "Text", required: false },
      { id: "ctaLabel", name: "CTA Label", type: "Symbol", required: true },
      { id: "ctaLink", name: "CTA Link", type: "Symbol", required: true },
      {
        id: "secondaryCtaLabel",
        name: "Secondary CTA Label",
        type: "Symbol",
        required: false,
      },
      {
        id: "profilePhoto",
        name: "Profile Photo",
        type: "Link",
        linkType: "Asset",
        required: true,
      },
      {
        id: "backgroundMedia",
        name: "Background Media",
        type: "Link",
        linkType: "Asset",
        required: false,
      },
    ],
  },
  {
    id: "aboutSection",
    name: "About Section",
    description: "About me content (singleton)",
    displayField: "heading",
    fields: [
      { id: "heading", name: "Heading", type: "Symbol", required: true },
      { id: "bio", name: "Bio", type: "RichText", required: true },
      {
        id: "photo",
        name: "Photo",
        type: "Link",
        linkType: "Asset",
        required: false,
      },
      {
        id: "highlights",
        name: "Highlights",
        type: "Object",
        required: false,
      },
    ],
  },
  {
    id: "project",
    name: "Project",
    description: "Portfolio project using STAR framework",
    displayField: "title",
    fields: [
      { id: "title", name: "Title", type: "Symbol", required: true },
      {
        id: "slug",
        name: "Slug",
        type: "Symbol",
        required: true,
        validations: [{ unique: true }],
      },
      { id: "context", name: "Context", type: "Text", required: true },
      { id: "objective", name: "Objective", type: "Text", required: true },
      { id: "role", name: "Role", type: "Symbol", required: true },
      { id: "actions", name: "Actions", type: "RichText", required: true },
      { id: "results", name: "Results", type: "RichText", required: true },
      {
        id: "thumbnail",
        name: "Thumbnail",
        type: "Link",
        linkType: "Asset",
        required: true,
      },
      {
        id: "gallery",
        name: "Gallery",
        type: "Array",
        items: { type: "Link", linkType: "Asset" },
        required: false,
      },
      {
        id: "tags",
        name: "Tags",
        type: "Array",
        items: { type: "Symbol" },
        required: false,
      },
      { id: "featured", name: "Featured", type: "Boolean", required: false },
      {
        id: "externalLink",
        name: "External Link",
        type: "Symbol",
        required: false,
      },
      {
        id: "sortOrder",
        name: "Sort Order",
        type: "Integer",
        required: true,
      },
    ],
  },
  {
    id: "skillCategory",
    name: "Skill Category",
    description: "Strengths or Tools category with skills",
    displayField: "categoryName",
    fields: [
      {
        id: "categoryName",
        name: "Category Name",
        type: "Symbol",
        required: true,
      },
      {
        id: "section",
        name: "Section",
        type: "Symbol",
        required: true,
        validations: [{ in: ["strengths", "tools"] }],
      },
      { id: "skills", name: "Skills", type: "Object", required: true },
      {
        id: "sortOrder",
        name: "Sort Order",
        type: "Integer",
        required: true,
      },
      {
        id: "displayStyle",
        name: "Display Style",
        type: "Symbol",
        required: false,
        validations: [{ in: ["bento-large", "bento-medium", "bento-small"] }],
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    description: "Education timeline entry",
    displayField: "program",
    fields: [
      { id: "program", name: "Program", type: "Symbol", required: true },
      {
        id: "institution",
        name: "Institution",
        type: "Symbol",
        required: true,
      },
      {
        id: "institutionLogo",
        name: "Institution Logo",
        type: "Link",
        linkType: "Asset",
        required: false,
      },
      {
        id: "dateRange",
        name: "Date Range",
        type: "Symbol",
        required: true,
      },
      {
        id: "focusAreas",
        name: "Focus Areas",
        type: "Array",
        items: { type: "Symbol" },
        required: false,
      },
      {
        id: "description",
        name: "Description",
        type: "RichText",
        required: false,
      },
      {
        id: "sortOrder",
        name: "Sort Order",
        type: "Integer",
        required: true,
      },
    ],
  },
  {
    id: "leadershipActivity",
    name: "Leadership Activity",
    description: "Leadership & extracurricular entry",
    displayField: "title",
    fields: [
      { id: "title", name: "Title", type: "Symbol", required: true },
      {
        id: "organization",
        name: "Organization",
        type: "Symbol",
        required: false,
      },
      {
        id: "dateRange",
        name: "Date Range",
        type: "Symbol",
        required: false,
      },
      {
        id: "description",
        name: "Description",
        type: "RichText",
        required: true,
      },
      {
        id: "image",
        name: "Image",
        type: "Link",
        linkType: "Asset",
        required: false,
      },
      {
        id: "sortOrder",
        name: "Sort Order",
        type: "Integer",
        required: true,
      },
    ],
  },
  {
    id: "contactSection",
    name: "Contact Section",
    description: "Contact information (singleton)",
    displayField: "heading",
    fields: [
      { id: "heading", name: "Heading", type: "Symbol", required: true },
      { id: "subheading", name: "Subheading", type: "Text", required: false },
      { id: "email", name: "Email", type: "Symbol", required: true },
      {
        id: "linkedinUrl",
        name: "LinkedIn URL",
        type: "Symbol",
        required: false,
      },
      { id: "location", name: "Location", type: "Symbol", required: false },
      {
        id: "additionalLinks",
        name: "Additional Links",
        type: "Object",
        required: false,
      },
    ],
  },
  {
    id: "navigationItem",
    name: "Navigation Item",
    description: "Navigation menu item",
    displayField: "label",
    fields: [
      { id: "label", name: "Label", type: "Symbol", required: true },
      { id: "anchor", name: "Anchor", type: "Symbol", required: true },
      {
        id: "sortOrder",
        name: "Sort Order",
        type: "Integer",
        required: true,
      },
    ],
  },
];

// ─── Field Builder ───────────────────────────────────────────────────

function buildField(f) {
  const field = {
    id: f.id,
    name: f.name,
    type: f.type,
    required: f.required ?? false,
    localized: false,
  };

  if (f.type === "Link") {
    field.linkType = f.linkType;
    field.validations = f.validations || [];
  }

  if (f.type === "Array") {
    field.items = f.items;
  }

  if (f.validations && f.type !== "Link") {
    field.validations = f.validations;
  }

  return field;
}

// ─── Sample Entry Data ───────────────────────────────────────────────

function richText(text) {
  return {
    nodeType: "document",
    data: {},
    content: [
      {
        nodeType: "paragraph",
        data: {},
        content: [{ nodeType: "text", value: text, marks: [], data: {} }],
      },
    ],
  };
}

const sampleEntries = [
  {
    contentType: "siteSettings",
    fields: {
      siteTitle: { "en-US": "Portfolio | Marketing Strategist" },
      siteDescription: {
        "en-US":
          "Marketing and business strategy portfolio showcasing creative campaigns, data-driven insights, and leadership experience.",
      },
    },
  },
  {
    contentType: "heroSection",
    fields: {
      greeting: { "en-US": "Hi, I'm" },
      name: { "en-US": "Your Name" },
      title: { "en-US": "Marketing & Business Strategist" },
      subtitle: {
        "en-US":
          "Aspiring marketing professional with a passion for data-driven strategy, creative campaigns, and brand storytelling. Currently seeking internship opportunities.",
      },
      ctaLabel: { "en-US": "View My Work" },
      ctaLink: { "en-US": "#projects" },
      secondaryCtaLabel: { "en-US": "Download Resume" },
    },
  },
  {
    contentType: "aboutSection",
    fields: {
      heading: { "en-US": "About Me" },
      bio: {
        "en-US": richText(
          "I am a passionate marketing student with experience in digital strategy, brand management, and market research. I bring creativity, analytical thinking, and a collaborative spirit to every project."
        ),
      },
      highlights: {
        "en-US": [
          { label: "Projects", value: "10+" },
          { label: "GPA", value: "3.8" },
          { label: "Certifications", value: "4" },
        ],
      },
    },
  },
  {
    contentType: "project",
    fields: {
      title: { "en-US": "Social Media Campaign Rebrand" },
      slug: { "en-US": "social-media-rebrand" },
      context: {
        "en-US":
          "A local business needed to refresh their social media presence to attract younger demographics.",
      },
      objective: {
        "en-US":
          "Increase social media engagement by 40% and grow follower count by 25% within 3 months.",
      },
      role: { "en-US": "Lead Marketing Strategist" },
      actions: {
        "en-US": richText(
          "Conducted audience analysis, developed content calendar, designed brand guidelines, managed influencer partnerships, and ran A/B tests on ad creatives."
        ),
      },
      results: {
        "en-US": richText(
          "Achieved 52% increase in engagement rate, 31% follower growth, and 3x increase in website traffic from social channels within the 3-month period."
        ),
      },
      tags: { "en-US": ["Social Media", "Branding", "Analytics"] },
      featured: { "en-US": true },
      sortOrder: { "en-US": 1 },
    },
  },
  {
    contentType: "skillCategory",
    fields: {
      categoryName: { "en-US": "Strategic & Analytical" },
      section: { "en-US": "strengths" },
      skills: {
        "en-US": [
          { name: "Market Research", icon: "Search" },
          { name: "Data Analysis", icon: "BarChart3" },
          { name: "Brand Strategy", icon: "Target" },
          { name: "Campaign Planning", icon: "Calendar" },
        ],
      },
      sortOrder: { "en-US": 1 },
      displayStyle: { "en-US": "bento-large" },
    },
  },
  {
    contentType: "skillCategory",
    fields: {
      categoryName: { "en-US": "Digital Marketing Tools" },
      section: { "en-US": "tools" },
      skills: {
        "en-US": [
          { name: "Google Analytics", icon: "BarChart3" },
          { name: "Canva", icon: "Palette" },
          { name: "Hootsuite", icon: "Share2" },
          { name: "Microsoft Excel", icon: "Table" },
        ],
      },
      sortOrder: { "en-US": 1 },
      displayStyle: { "en-US": "bento-large" },
    },
  },
  {
    contentType: "education",
    fields: {
      program: { "en-US": "B.S. Marketing & Business Administration" },
      institution: { "en-US": "University Name" },
      dateRange: { "en-US": "2022 - 2026" },
      focusAreas: {
        "en-US": ["Digital Marketing", "Consumer Behavior", "Analytics"],
      },
      description: {
        "en-US": richText(
          "Dean's List. Relevant coursework: Digital Marketing Strategy, Consumer Behavior, Marketing Analytics, Business Communication."
        ),
      },
      sortOrder: { "en-US": 1 },
    },
  },
  {
    contentType: "leadershipActivity",
    fields: {
      title: { "en-US": "Marketing Club President" },
      organization: { "en-US": "University Marketing Association" },
      dateRange: { "en-US": "2024 - Present" },
      description: {
        "en-US": richText(
          "Led a team of 15 members in organizing marketing workshops, networking events, and case competitions. Grew club membership by 40%."
        ),
      },
      sortOrder: { "en-US": 1 },
    },
  },
  {
    contentType: "contactSection",
    fields: {
      heading: { "en-US": "Let's Connect" },
      subheading: {
        "en-US":
          "I'm actively seeking internship and junior marketing roles. Let's discuss how I can contribute to your team.",
      },
      email: { "en-US": "hello@example.com" },
      linkedinUrl: { "en-US": "https://linkedin.com/in/yourprofile" },
      location: { "en-US": "Mexico City, MX" },
      additionalLinks: {
        "en-US": [
          {
            label: "LinkedIn",
            url: "https://linkedin.com/in/yourprofile",
            icon: "Linkedin",
          },
        ],
      },
    },
  },
  // Navigation items
  ...["About", "Projects", "Strengths", "Education", "Leadership", "Tools", "Contact"].map(
    (label, i) => ({
      contentType: "navigationItem",
      fields: {
        label: { "en-US": label },
        anchor: { "en-US": `#${label.toLowerCase()}` },
        sortOrder: { "en-US": i + 1 },
      },
    })
  ),
];

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Setting up Contentful content model...\n");

  const env = await getEnvironment();

  // Create content types
  console.log("📦 Creating content types:");
  for (const ct of contentTypes) {
    const builtFields = ct.fields.map(buildField);
    await createOrUpdateContentType(env, ct.id, {
      ...ct,
      fields: builtFields,
    });
  }

  console.log("\n✅ All content types created and published!\n");

  // Create sample entries
  console.log("📝 Creating sample entries:");
  for (const entry of sampleEntries) {
    try {
      const created = await env.createEntry(entry.contentType, {
        fields: entry.fields,
      });
      await created.publish();
      const title =
        entry.fields.siteTitle?.["en-US"] ||
        entry.fields.name?.["en-US"] ||
        entry.fields.heading?.["en-US"] ||
        entry.fields.title?.["en-US"] ||
        entry.fields.categoryName?.["en-US"] ||
        entry.fields.program?.["en-US"] ||
        entry.fields.label?.["en-US"] ||
        "entry";
      console.log(`  ✓ ${entry.contentType}: "${title}"`);
    } catch (err) {
      console.warn(
        `  ⚠ Failed to create ${entry.contentType}: ${err.message}`
      );
    }
  }

  console.log("\n🎉 Setup complete! Your Contentful space is ready.");
  console.log(
    "   Note: Some entries (like heroSection) require image assets."
  );
  console.log(
    "   Upload images in the Contentful UI and link them to entries."
  );
}

main().catch((err) => {
  console.error("❌ Setup failed:", err);
  process.exit(1);
});

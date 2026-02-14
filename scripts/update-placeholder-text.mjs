/**
 * Update all Contentful entries with lorem ipsum placeholder text.
 * Run: node scripts/update-placeholder-text.mjs
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

async function main() {
  console.log("📝 Updating entries with lorem ipsum text...\n");
  const env = await getEnvironment();

  // --- siteSettings ---
  await updateEntry(env, "siteSettings", {
    siteTitle: "Angelica Guze | Marketing Strategist",
    siteDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Portfolio showcasing marketing strategy, brand development, and data-driven campaign management. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  });

  // --- heroSection ---
  await updateEntry(env, "heroSection", {
    greeting: "Hi, I'm",
    name: "Angelica Guze",
    title: "Marketing & Business Strategist",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Passionate about transforming data into compelling brand narratives.",
    ctaLabel: "View My Work",
    ctaLink: "#projects",
    secondaryCtaLabel: "Download Resume",
  });

  // --- aboutSection ---
  await updateEntry(env, "aboutSection", {
    heading: "About Me",
    bio: richText(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus, nulla facilisi.",
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est."
    ),
    highlights: [
      { label: "Projects", value: "12+" },
      { label: "GPA", value: "3.9" },
      { label: "Certifications", value: "5" },
    ],
  });

  // --- project ---
  const projectEntries = await env.getEntries({ content_type: "project" });
  if (projectEntries.items.length > 0) {
    const proj = projectEntries.items[0];
    proj.fields.title = { "en-US": "Campus Brand Revitalization Campaign" };
    proj.fields.slug = { "en-US": "campus-brand-revitalization" };
    proj.fields.context = {
      "en-US":
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    };
    proj.fields.objective = {
      "en-US":
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Target a 45% increase in brand awareness metrics within one academic semester.",
    };
    proj.fields.role = { "en-US": "Lead Brand Strategist & Campaign Manager" };
    proj.fields.actions = {
      "en-US": richTextWithBullets(
        "Executed a comprehensive multi-channel strategy:",
        [
          "Conducted stakeholder interviews and competitive audit across 12 peer institutions to identify positioning gaps",
          "Developed integrated content calendar spanning Instagram, LinkedIn, and TikTok with 60+ planned touchpoints",
          "Designed A/B tested ad creatives using Canva and Figma, iterating based on weekly performance data",
          "Coordinated influencer partnerships with 8 campus micro-influencers to amplify organic reach",
          "Built automated reporting dashboard in Google Data Studio tracking KPIs across all channels",
        ],
        null
      ),
    };
    proj.fields.results = {
      "en-US": richTextWithBullets(
        "Campaign delivered measurable impact across all target metrics:",
        [
          "52% increase in social media engagement rate (vs. 40% target)",
          "31% growth in follower count across platforms within 90 days",
          "3.2x increase in website referral traffic from social channels",
          "Brand sentiment score improved from 6.2 to 8.7 (out of 10) in post-campaign survey",
          "Campaign framework adopted by 3 additional student organizations",
        ],
        null
      ),
    };
    proj.fields.tags = {
      "en-US": [
        "Brand Strategy",
        "Social Media",
        "Analytics",
        "Content Marketing",
      ],
    };
    proj.fields.featured = { "en-US": true };
    proj.fields.sortOrder = { "en-US": 1 };
    const updated = await proj.update();
    await updated.publish();
    console.log('  ✓ project: "Campus Brand Revitalization Campaign"');
  }

  // --- Create a second project (no thumbnail required if we reuse) ---
  try {
    const proj2 = await env.createEntry("project", {
      fields: {
        title: { "en-US": "Market Research & Consumer Insights Study" },
        slug: { "en-US": "market-research-insights" },
        context: {
          "en-US":
            "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam quis risus eget urna mollis ornare vel eu leo. A regional retail chain sought to understand shifting consumer preferences in the post-pandemic landscape.",
        },
        objective: {
          "en-US":
            "Maecenas sed diam eget risus varius blandit sit amet non magna. Deliver actionable consumer insights to inform the client's Q3 product positioning and pricing strategy.",
        },
        role: { "en-US": "Research Lead & Data Analyst" },
        actions: {
          "en-US": richTextWithBullets(
            "Led end-to-end primary and secondary research initiative:",
            [
              "Designed and deployed a 42-question survey instrument distributed to 500+ respondents across 3 market segments",
              "Facilitated 6 focus group sessions with demographically diverse participant pools",
              "Performed quantitative analysis using SPSS and Excel, identifying 4 statistically significant consumer behavior shifts",
              "Synthesized findings into a 35-page strategic recommendation deck with actionable next steps",
            ],
            null
          ),
        },
        results: {
          "en-US": richTextWithBullets(
            "Research directly influenced client strategy:",
            [
              "Client adopted 3 of 4 pricing recommendations, resulting in 18% margin improvement in Q3",
              "Consumer segmentation model reduced ad spend waste by 22% through improved targeting",
              "Research methodology was documented as a repeatable framework for future studies",
            ],
            null
          ),
        },
        tags: {
          "en-US": [
            "Market Research",
            "Data Analysis",
            "Consumer Behavior",
            "Strategy",
          ],
        },
        featured: { "en-US": false },
        sortOrder: { "en-US": 2 },
        thumbnail: projectEntries.items[0]?.fields.thumbnail, // reuse same thumbnail
      },
    });
    await proj2.publish();
    console.log('  ✓ project: "Market Research & Consumer Insights Study"');
  } catch (err) {
    console.log(`  ⚠ Second project: ${err.message}`);
  }

  // --- skillCategory (strengths) ---
  const skillEntries = await env.getEntries({ content_type: "skillCategory" });
  for (const entry of skillEntries.items) {
    if (entry.fields.section["en-US"] === "strengths") {
      entry.fields.categoryName = { "en-US": "Strategic & Analytical" };
      entry.fields.skills = {
        "en-US": [
          { name: "Market Research & Analysis", icon: "Search" },
          { name: "Data-Driven Decision Making", icon: "BarChart3" },
          { name: "Brand Strategy & Positioning", icon: "Target" },
          { name: "Campaign Planning & Execution", icon: "Calendar" },
          { name: "Consumer Behavior Insights", icon: "Users" },
          { name: "Competitive Intelligence", icon: "TrendingUp" },
        ],
      };
      entry.fields.displayStyle = { "en-US": "bento-large" };
      const updated = await entry.update();
      await updated.publish();
      console.log('  ✓ skillCategory (strengths): "Strategic & Analytical"');
    }

    if (entry.fields.section["en-US"] === "tools") {
      entry.fields.categoryName = { "en-US": "Digital Marketing Stack" };
      entry.fields.skills = {
        "en-US": [
          { name: "Google Analytics", icon: "BarChart3" },
          { name: "Hootsuite / Buffer", icon: "Share2" },
          { name: "Canva & Adobe Suite", icon: "Palette" },
          { name: "Microsoft Excel", icon: "Table" },
          { name: "HubSpot CRM", icon: "Database" },
          { name: "WordPress / CMS", icon: "Globe" },
        ],
      };
      entry.fields.displayStyle = { "en-US": "bento-large" };
      const updated = await entry.update();
      await updated.publish();
      console.log('  ✓ skillCategory (tools): "Digital Marketing Stack"');
    }
  }

  // Create additional skill categories
  try {
    const creative = await env.createEntry("skillCategory", {
      fields: {
        categoryName: { "en-US": "Creative & Communication" },
        section: { "en-US": "strengths" },
        skills: {
          "en-US": [
            { name: "Copywriting & Storytelling", icon: "PenTool" },
            { name: "Public Speaking", icon: "MessageSquare" },
            { name: "Visual Design Thinking", icon: "Layout" },
            { name: "Cross-functional Collaboration", icon: "Users" },
          ],
        },
        sortOrder: { "en-US": 2 },
        displayStyle: { "en-US": "bento-medium" },
      },
    });
    await creative.publish();
    console.log('  ✓ skillCategory: "Creative & Communication"');
  } catch (err) {
    console.log(`  ⚠ Creative skills: ${err.message}`);
  }

  try {
    const productivity = await env.createEntry("skillCategory", {
      fields: {
        categoryName: { "en-US": "Productivity & Collaboration" },
        section: { "en-US": "tools" },
        skills: {
          "en-US": [
            { name: "Notion / Asana", icon: "Layout" },
            { name: "Google Workspace", icon: "Globe" },
            { name: "Slack / Teams", icon: "MessageSquare" },
            { name: "Zoom / Loom", icon: "Users" },
          ],
        },
        sortOrder: { "en-US": 2 },
        displayStyle: { "en-US": "bento-medium" },
      },
    });
    await productivity.publish();
    console.log('  ✓ skillCategory: "Productivity & Collaboration"');
  } catch (err) {
    console.log(`  ⚠ Productivity tools: ${err.message}`);
  }

  // --- education ---
  await updateEntry(env, "education", {
    program: "B.S. Marketing & Business Administration",
    institution: "Universidad Nacional Autónoma de México",
    dateRange: "2022 – 2026",
    focusAreas: [
      "Digital Marketing",
      "Consumer Behavior",
      "Marketing Analytics",
      "Brand Management",
    ],
    description: richText(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dean's List recipient for 6 consecutive semesters. Relevant coursework includes Digital Marketing Strategy, Consumer Behavior, Marketing Analytics, Strategic Brand Management, and Business Communication.",
      "Curabitur blandit tempus porttitor. Participated in university case competitions and marketing research symposiums. Vestibulum id ligula porta felis euismod semper."
    ),
  });

  // --- leadershipActivity ---
  const leaderEntries = await env.getEntries({
    content_type: "leadershipActivity",
  });
  if (leaderEntries.items.length > 0) {
    const leader = leaderEntries.items[0];
    leader.fields.title = { "en-US": "Marketing Club President" };
    leader.fields.organization = {
      "en-US": "University Marketing Association",
    };
    leader.fields.dateRange = { "en-US": "2024 – Present" };
    leader.fields.description = {
      "en-US": richText(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Led a team of 20 members in organizing bi-weekly marketing workshops, industry networking events, and inter-university case competitions. Grew club membership by 45% through targeted campus outreach.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. Coordinated partnerships with 5 local businesses for real-world marketing projects, providing students with hands-on portfolio-building opportunities."
      ),
    };
    const updated = await leader.update();
    await updated.publish();
    console.log('  ✓ leadershipActivity: "Marketing Club President"');
  }

  // Create second leadership entry
  try {
    const leader2 = await env.createEntry("leadershipActivity", {
      fields: {
        title: { "en-US": "Toastmasters International Participant" },
        organization: { "en-US": "Campus Toastmasters Chapter" },
        dateRange: { "en-US": "2023 – Present" },
        description: {
          "en-US": richText(
            "Nullam quis risus eget urna mollis ornare vel eu leo. Completed 15+ prepared speeches and earned Competent Communicator designation. Regularly serve as meeting evaluator and timer, developing critical feedback and time-management skills.",
            "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Won 2nd place in regional impromptu speaking competition against 40+ participants."
          ),
        },
        sortOrder: { "en-US": 2 },
      },
    });
    await leader2.publish();
    console.log('  ✓ leadershipActivity: "Toastmasters International"');
  } catch (err) {
    console.log(`  ⚠ Second leadership: ${err.message}`);
  }

  // --- contactSection ---
  await updateEntry(env, "contactSection", {
    heading: "Let's Connect",
    subheading:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. I'm actively seeking internship and junior marketing roles where I can contribute data-driven strategy and creative energy. Ut enim ad minim veniam, let's discuss how we can work together.",
    email: "angelica.guze@email.com",
    linkedinUrl: "https://linkedin.com/in/angelicaguze",
    location: "Mexico City, MX",
    additionalLinks: [
      {
        label: "LinkedIn",
        url: "https://linkedin.com/in/angelicaguze",
        icon: "Linkedin",
      },
    ],
  });

  console.log("\n🎉 All entries updated with placeholder text!");
}

main().catch((err) => {
  console.error("❌ Failed:", err.message || err);
  process.exit(1);
});

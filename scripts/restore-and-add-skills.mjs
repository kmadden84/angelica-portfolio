/**
 * Restore original skill categories AND add the new ones from professor feedback.
 * Run: node scripts/restore-and-add-skills.mjs
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

async function main() {
  console.log("🔧 Restoring original + adding new skill categories...\n");
  const env = await getEnvironment();

  // Delete current (broken) entries
  const existing = await env.getEntries({ content_type: "skillCategory", limit: 100 });
  for (const entry of existing.items) {
    try {
      if (entry.sys.publishedVersion) await entry.unpublish();
      await entry.delete();
    } catch (err) {
      console.log(`  ⚠ Could not delete: ${err.message}`);
    }
  }
  console.log(`  ✓ Deleted ${existing.items.length} current skillCategory entries\n`);

  const skillCategories = [
    // ═══════════════════════════════════════════════════════════
    // NEW categories from professor feedback (strengths section)
    // ═══════════════════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════════════════
    // ORIGINAL strength categories (restored)
    // ═══════════════════════════════════════════════════════════
    {
      categoryName: "Sales & Leadership",
      section: "strengths",
      skills: [
        { name: "7 Years in Sales, Service & Leadership", icon: "Briefcase" },
        { name: "1 Year Account Management at X (Twitter)", icon: "TrendingUp" },
        { name: "Top Performer, 1-in-4 Conversion Rate", icon: "Award" },
        { name: "Awarded for Creativity & Salesmanship", icon: "Star" },
        { name: "Promoted to Leadership in 2 Years", icon: "Shield" },
        { name: "B2B & B2C Relationship Management", icon: "Users" },
      ],
      sortOrder: 5,
      displayStyle: "bento-large",
    },
    {
      categoryName: "Marketing & Creative",
      section: "strengths",
      skills: [
        { name: "Product Demonstration & Presentations", icon: "Layout" },
        { name: "Social Media Marketing", icon: "Share2" },
        { name: "Content Writing & Storytelling", icon: "PenTool" },
        { name: "Visual Merchandising & Luxury Retail", icon: "Eye" },
        { name: "Negotiation Skills", icon: "MessageSquare" },
      ],
      sortOrder: 6,
      displayStyle: "bento-large",
    },
    {
      categoryName: "Communication & Interpersonal",
      section: "strengths",
      skills: [
        { name: "Strong Communication & Client Interaction", icon: "MessageSquare" },
        { name: "Empathy & Emotional Intelligence", icon: "Heart" },
        { name: "Public Speaking (Toastmasters)", icon: "Mic" },
        { name: "Active Listening & Mentoring", icon: "Users" },
        { name: "Problem-Solving Under Pressure", icon: "Zap" },
        { name: "Team Collaboration & Coordination", icon: "Layout" },
      ],
      sortOrder: 7,
      displayStyle: "bento-large",
    },
    {
      categoryName: "Leadership & Growth Mindset",
      section: "strengths",
      skills: [
        { name: "Decision-Making in Fast-Paced Environments", icon: "Target" },
        { name: "Adaptability & Fast Learning", icon: "Compass" },
        { name: "Creative Thinking & Solution Generation", icon: "Lightbulb" },
        { name: "Leadership Presence & Team Motivation", icon: "Star" },
        { name: "Self-Motivated & Growth-Oriented", icon: "Rocket" },
        { name: "Team Player", icon: "Users" },
      ],
      sortOrder: 8,
      displayStyle: "bento-large",
    },

    // ═══════════════════════════════════════════════════════════
    // ORIGINAL tool categories (restored)
    // ═══════════════════════════════════════════════════════════
    {
      categoryName: "CRM & Analytics",
      section: "tools",
      skills: [
        { name: "Salesforce CRM", icon: "Database" },
        { name: "Google Analytics", icon: "BarChart3" },
        { name: "Meta Ads Manager", icon: "Megaphone" },
        { name: "LinkedIn Analytics", icon: "TrendingUp" },
      ],
      sortOrder: 1,
      displayStyle: "bento-large",
    },
    {
      categoryName: "Design & Content",
      section: "tools",
      skills: [
        { name: "Canva", icon: "Palette" },
        { name: "WordPress & Website Updates", icon: "Globe" },
        { name: "Graphic Design", icon: "PenTool" },
      ],
      sortOrder: 2,
      displayStyle: "bento-medium",
    },
    {
      categoryName: "Productivity & Office",
      section: "tools",
      skills: [
        { name: "Microsoft Excel", icon: "Table" },
        { name: "Microsoft Word", icon: "PenTool" },
        { name: "Microsoft PowerPoint", icon: "Layout" },
      ],
      sortOrder: 3,
      displayStyle: "bento-medium",
    },
    {
      categoryName: "AI & SaaS",
      section: "tools",
      skills: [
        { name: "AI Tools & Automation", icon: "Zap" },
        { name: "SaaS Platforms", icon: "Cloud" },
      ],
      sortOrder: 4,
      displayStyle: "bento-medium",
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
      console.log(`  ✓ [${cat.section}] "${cat.categoryName}"`);
    } catch (err) {
      console.log(`  ⚠ "${cat.categoryName}": ${err.message}`);
    }
  }

  console.log("\n🎉 All skill categories restored + new ones added!");
}

main().catch((err) => {
  console.error("❌ Failed:", err.message || err);
  process.exit(1);
});

/**
 * Upload images to Contentful and link them to entries.
 * Run: node scripts/upload-assets.mjs
 */

import contentfulManagement from "contentful-management";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";

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

async function uploadAsset(env, { filePath, title, description, contentType }) {
  console.log(`  📤 Uploading "${title}"...`);

  const fileData = readFileSync(resolve(filePath));

  // Create upload
  const upload = await env.createUpload({ file: fileData });

  // Create asset linked to upload
  const asset = await env.createAsset({
    fields: {
      title: { "en-US": title },
      description: { "en-US": description || "" },
      file: {
        "en-US": {
          contentType,
          fileName: filePath.split("/").pop(),
          uploadFrom: {
            sys: { type: "Link", linkType: "Upload", id: upload.sys.id },
          },
        },
      },
    },
  });

  // Process (generates optimized versions)
  const processed = await asset.processForAllLocales();

  // Wait for processing to complete
  let attempts = 0;
  let ready = false;
  while (!ready && attempts < 30) {
    attempts++;
    await new Promise((r) => setTimeout(r, 1500));
    try {
      const refreshed = await env.getAsset(processed.sys.id);
      if (refreshed.fields.file["en-US"].url) {
        ready = true;
      }
    } catch {
      // still processing
    }
  }

  // Publish
  const latest = await env.getAsset(processed.sys.id);
  const published = await latest.publish();
  console.log(`  ✓ "${title}" uploaded and published`);
  return published;
}

function assetLink(asset) {
  return {
    "en-US": {
      sys: { type: "Link", linkType: "Asset", id: asset.sys.id },
    },
  };
}

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

async function main() {
  console.log("🖼️  Uploading assets to Contentful...\n");
  const env = await getEnvironment();

  // Upload all images
  const assets = {};

  const imageConfigs = [
    {
      key: "profile",
      filePath: "images/profile-photo.jpg",
      title: "Profile Photo",
      description: "Professional headshot",
      contentType: "image/jpeg",
    },
    {
      key: "about",
      filePath: "images/about-photo.jpg",
      title: "About Photo",
      description: "Working environment photo",
      contentType: "image/jpeg",
    },
    {
      key: "projectThumb",
      filePath: "images/project-thumbnail.jpg",
      title: "Project Thumbnail",
      description: "Project cover image",
      contentType: "image/jpeg",
    },
    {
      key: "og",
      filePath: "images/og-image.jpg",
      title: "OG Image",
      description: "Social sharing image",
      contentType: "image/jpeg",
    },
    {
      key: "logo",
      filePath: "images/institution-logo.jpg",
      title: "Institution Logo",
      description: "University logo",
      contentType: "image/jpeg",
    },
    {
      key: "leadership",
      filePath: "images/leadership-photo.jpg",
      title: "Leadership Photo",
      description: "Team leadership activity photo",
      contentType: "image/jpeg",
    },
  ];

  for (const img of imageConfigs) {
    assets[img.key] = await uploadAsset(env, img);
  }

  console.log("\n🔗 Linking assets to entries...\n");

  // --- Update siteSettings with OG image ---
  const siteEntries = await env.getEntries({ content_type: "siteSettings" });
  if (siteEntries.items.length > 0) {
    const site = siteEntries.items[0];
    site.fields.ogImage = assetLink(assets.og);
    const updated = await site.update();
    await updated.publish();
    console.log("  ✓ siteSettings: linked OG image");
  }

  // --- Create heroSection with profile photo ---
  // First check if a draft exists from the failed publish attempt
  const heroEntries = await env.getEntries({ content_type: "heroSection" });
  if (heroEntries.items.length > 0) {
    // Update existing draft
    const hero = heroEntries.items[0];
    hero.fields.profilePhoto = assetLink(assets.profile);
    const updated = await hero.update();
    await updated.publish();
    console.log("  ✓ heroSection: linked profile photo (updated existing)");
  } else {
    // Create new
    const hero = await env.createEntry("heroSection", {
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
        profilePhoto: assetLink(assets.profile),
      },
    });
    await hero.publish();
    console.log("  ✓ heroSection: created with profile photo");
  }

  // --- Update aboutSection with photo ---
  const aboutEntries = await env.getEntries({ content_type: "aboutSection" });
  if (aboutEntries.items.length > 0) {
    const about = aboutEntries.items[0];
    about.fields.photo = assetLink(assets.about);
    const updated = await about.update();
    await updated.publish();
    console.log("  ✓ aboutSection: linked about photo");
  }

  // --- Create project with thumbnail ---
  const projectEntries = await env.getEntries({ content_type: "project" });
  if (projectEntries.items.length > 0) {
    // Update existing draft
    const proj = projectEntries.items[0];
    proj.fields.thumbnail = assetLink(assets.projectThumb);
    const updated = await proj.update();
    await updated.publish();
    console.log("  ✓ project: linked thumbnail (updated existing)");
  } else {
    const proj = await env.createEntry("project", {
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
        thumbnail: assetLink(assets.projectThumb),
      },
    });
    await proj.publish();
    console.log("  ✓ project: created with thumbnail");
  }

  // --- Update education with logo ---
  const eduEntries = await env.getEntries({ content_type: "education" });
  if (eduEntries.items.length > 0) {
    const edu = eduEntries.items[0];
    edu.fields.institutionLogo = assetLink(assets.logo);
    const updated = await edu.update();
    await updated.publish();
    console.log("  ✓ education: linked institution logo");
  }

  // --- Update leadership with photo ---
  const leaderEntries = await env.getEntries({
    content_type: "leadershipActivity",
  });
  if (leaderEntries.items.length > 0) {
    const leader = leaderEntries.items[0];
    leader.fields.image = assetLink(assets.leadership);
    const updated = await leader.update();
    await updated.publish();
    console.log("  ✓ leadershipActivity: linked photo");
  }

  console.log("\n🎉 All assets uploaded and linked!");
}

main().catch((err) => {
  console.error("❌ Failed:", err.message || err);
  process.exit(1);
});

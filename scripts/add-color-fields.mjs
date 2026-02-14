/**
 * Adds backgroundColor and navyColor fields to siteSettings content type,
 * then updates the entry with the color values.
 *
 * Run: node scripts/add-color-fields.mjs
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

async function run() {
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment(ENVIRONMENT_ID);

  // --- Step 1: Add fields to siteSettings content type ---
  console.log("1. Updating siteSettings content type...");
  let ct = await env.getContentType("siteSettings");

  const existingFieldIds = ct.fields.map((f) => f.id);

  if (!existingFieldIds.includes("backgroundColor")) {
    ct.fields.push({
      id: "backgroundColor",
      name: "Background Color",
      type: "Symbol",
      required: false,
      localized: false,
      validations: [{ regexp: { pattern: "^#[0-9A-Fa-f]{6}$" } }],
    });
    console.log("   + Added backgroundColor field");
  } else {
    console.log("   ~ backgroundColor field already exists");
  }

  if (!existingFieldIds.includes("navyColor")) {
    ct.fields.push({
      id: "navyColor",
      name: "Navy/Dark Color",
      type: "Symbol",
      required: false,
      localized: false,
      validations: [{ regexp: { pattern: "^#[0-9A-Fa-f]{6}$" } }],
    });
    console.log("   + Added navyColor field");
  } else {
    console.log("   ~ navyColor field already exists");
  }

  if (!existingFieldIds.includes("lavenderColor")) {
    ct.fields.push({
      id: "lavenderColor",
      name: "Lavender/Tag Color",
      type: "Symbol",
      required: false,
      localized: false,
      validations: [{ regexp: { pattern: "^#[0-9A-Fa-f]{6}$" } }],
    });
    console.log("   + Added lavenderColor field");
  } else {
    console.log("   ~ lavenderColor field already exists");
  }

  ct = await ct.update();
  ct = await ct.publish();
  console.log("   ✓ Content type updated & published\n");

  // --- Step 2: Update the siteSettings entry with color values ---
  console.log("2. Updating siteSettings entry with color values...");
  const entries = await env.getEntries({ content_type: "siteSettings", limit: 1 });

  if (entries.items.length === 0) {
    console.error("   ✗ No siteSettings entry found!");
    process.exit(1);
  }

  let entry = entries.items[0];
  const locale = "en-US";

  entry.fields.backgroundColor = { [locale]: "#EEEEF1" };
  entry.fields.navyColor = { [locale]: "#1E1E2E" };
  entry.fields.lavenderColor = { [locale]: "#DDD8E8" };
  // Ensure accent & primary are also set
  entry.fields.primaryColor = { [locale]: "#2D3436" };
  entry.fields.accentColor = { [locale]: "#6C5CE7" };

  entry = await entry.update();
  entry = await entry.publish();
  console.log("   ✓ Entry updated with colors:");
  console.log("     backgroundColor: #EEEEF1");
  console.log("     navyColor:       #1E1E2E");
  console.log("     lavenderColor:   #DDD8E8");
  console.log("     primaryColor:    #2D3436");
  console.log("     accentColor:     #6C5CE7");

  console.log("\n✅ Done! All colors are now Contentful-driven.");
}

run().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});

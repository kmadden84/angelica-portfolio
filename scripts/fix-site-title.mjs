/**
 * Fix siteTitle ONLY — no other fields or content types are touched.
 */
import contentfulManagement from "contentful-management";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function run() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment("master");

  const entries = await env.getEntries({ content_type: "siteSettings", limit: 1 });
  const entry = entries.items[0];

  if (!entry) {
    console.error("No siteSettings entry found");
    process.exit(1);
  }

  const currentTitle = entry.fields.siteTitle?.["en-US"];
  console.log("Current siteTitle:", JSON.stringify(currentTitle));

  // Only update siteTitle — leave all other fields untouched
  entry.fields.siteTitle = { "en-US": "Angelica Guze | Marketing Strategist" };

  const updated = await entry.update();
  await updated.publish();
  console.log("✓ siteTitle fixed to: \"Angelica Guze | Marketing Strategist\"");
}

run().catch(console.error);

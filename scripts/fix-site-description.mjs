/**
 * Fix siteDescription ONLY — no other fields or content types are touched.
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

  console.log("Current siteDescription:", JSON.stringify(entry.fields.siteDescription?.["en-US"]).substring(0, 80) + "...");

  // Only update siteDescription — leave all other fields untouched
  entry.fields.siteDescription = {
    "en-US":
      "Marketing & Business Strategist with 7+ years of experience in sales, account management, and brand development. Portfolio showcasing marketing strategy, creative content, and data-driven campaign results.",
  };

  const updated = await entry.update();
  await updated.publish();
  console.log("✓ siteDescription updated (lorem ipsum replaced)");
}

run().catch(console.error);

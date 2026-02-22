/**
 * Fix navigation items ONLY — no other content types touched.
 * Deletes corrupted entry, adds missing About & Experience,
 * and corrects sort order.
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

  // Delete all existing nav items
  const entries = await env.getEntries({ content_type: "navigationItem", limit: 20 });
  for (const entry of entries.items) {
    try {
      if (entry.sys.publishedVersion) await entry.unpublish();
      await entry.delete();
    } catch (err) {
      console.log(`  ⚠ Could not delete: ${err.message}`);
    }
  }
  console.log(`Deleted ${entries.items.length} old navigation items`);

  // Recreate with correct labels and anchors
  const navItems = [
    { label: "About", anchor: "#about", sortOrder: 1 },
    { label: "Projects", anchor: "#projects", sortOrder: 2 },
    { label: "Strengths", anchor: "#strengths", sortOrder: 3 },
    { label: "Experience", anchor: "#experience", sortOrder: 4 },
    { label: "Education", anchor: "#education", sortOrder: 5 },
    { label: "Leadership", anchor: "#leadership", sortOrder: 6 },
    { label: "Tools", anchor: "#tools", sortOrder: 7 },
    { label: "Contact", anchor: "#contact", sortOrder: 8 },
  ];

  for (const item of navItems) {
    const entry = await env.createEntry("navigationItem", {
      fields: {
        label: { "en-US": item.label },
        anchor: { "en-US": item.anchor },
        sortOrder: { "en-US": item.sortOrder },
      },
    });
    await entry.publish();
    console.log(`  ✓ ${item.label} → ${item.anchor}`);
  }

  console.log("\n✓ Navigation fixed!");
}

run().catch(console.error);

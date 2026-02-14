import contentfulManagement from "contentful-management";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function run() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment("master");

  const entries = await env.getEntries({ content_type: "contactSection", limit: 1 });
  let entry = entries.items[0];

  const locale = "en-US";
  const links = entry.fields.additionalLinks?.[locale] || [];

  // Remove any LinkedIn entries from additionalLinks since linkedinUrl handles it
  const filtered = links.filter(
    (l) => !l.label.toLowerCase().includes("linkedin")
  );

  console.log(`Before: ${links.length} links, After: ${filtered.length} links`);
  console.log("Removed:", links.filter(l => l.label.toLowerCase().includes("linkedin")).map(l => l.label));

  entry.fields.additionalLinks = { [locale]: filtered };
  entry = await entry.update();
  entry = await entry.publish();
  console.log("Done — duplicate LinkedIn removed from additionalLinks.");
}

run().catch(console.error);

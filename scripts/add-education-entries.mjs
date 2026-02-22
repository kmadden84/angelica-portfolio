/**
 * Add two new education entries to Contentful.
 * Run: node scripts/add-education-entries.mjs
 */

import contentfulManagement from "contentful-management";
import { config } from "dotenv";

config({ path: ".env.local" });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || "master";

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error(
    "CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be set in .env.local"
  );
  process.exit(1);
}

const client = contentfulManagement.createClient({
  accessToken: MANAGEMENT_TOKEN,
});

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
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment(ENVIRONMENT_ID);

  const entries = [
    {
      fields: {
        program: { "en-US": "Business Management | Supply Chain, Business Management Certificate" },
        institution: { "en-US": "Toronto Metropolitan University" },
        dateRange: { "en-US": "Dec 2025 – Apr 2027" },
        focusAreas: {
          "en-US": ["Supply Chain", "Business Management"],
        },
        sortOrder: { "en-US": 1 },
      },
    },
    {
      fields: {
        program: { "en-US": "International Business Essentials" },
        institution: { "en-US": "University of London" },
        dateRange: { "en-US": "Issued Feb 2022" },
        focusAreas: {
          "en-US": ["International Business"],
        },
        sortOrder: { "en-US": 2 },
      },
    },
  ];

  for (const entry of entries) {
    console.log(`Creating: ${entry.fields.program["en-US"]}...`);
    const created = await env.createEntry("education", entry);
    await created.publish();
    console.log(`  Published: ${created.sys.id}`);
  }

  console.log("Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

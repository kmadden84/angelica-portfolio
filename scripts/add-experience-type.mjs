/**
 * Creates the "experience" content type in Contentful and adds a sample entry.
 *
 * Fields: jobTitle, company, companyLogo, dateRange, description, tags, sortOrder
 *
 * Run: node scripts/add-experience-type.mjs
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

async function run() {
  const space = await client.getSpace(SPACE_ID);
  const env = await space.getEnvironment(ENVIRONMENT_ID);

  // --- Step 1: Create or update the content type ---
  console.log("1. Creating experience content type...");

  let ct;
  try {
    ct = await env.getContentType("experience");
    console.log("   ⟳ Content type already exists, updating...");
    ct.name = "Experience";
    ct.description = "Work experience / job history entries";
    ct.displayField = "jobTitle";
    ct.fields = getFields();
    ct = await ct.update();
  } catch {
    console.log("   + Creating new content type...");
    ct = await env.createContentTypeWithId("experience", {
      name: "Experience",
      description: "Work experience / job history entries",
      displayField: "jobTitle",
      fields: getFields(),
    });
  }

  await ct.publish();
  console.log("   ✓ Content type published\n");

  // --- Step 2: Create a sample entry ---
  console.log("2. Creating sample experience entry...");

  const existing = await env.getEntries({
    content_type: "experience",
    limit: 1,
  });

  if (existing.items.length > 0) {
    console.log("   ~ Sample entry already exists, skipping.\n");
  } else {
    const locale = "en-US";
    let entry = await env.createEntry("experience", {
      fields: {
        jobTitle: { [locale]: "UX Design Intern" },
        company: { [locale]: "Acme Corp" },
        dateRange: { [locale]: "Jun 2024 – Aug 2024" },
        description: {
          [locale]: {
            nodeType: "document",
            data: {},
            content: [
              {
                nodeType: "paragraph",
                data: {},
                content: [
                  {
                    nodeType: "text",
                    value:
                      "Collaborated with cross-functional teams to redesign the customer onboarding flow, improving completion rates by 25%.",
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          },
        },
        tags: { [locale]: ["Figma", "User Research", "Prototyping"] },
        sortOrder: { [locale]: 1 },
      },
    });

    entry = await entry.publish();
    console.log("   ✓ Sample entry created & published\n");
  }

  console.log("✅ Done! Experience content type is ready.");
}

function getFields() {
  return [
    {
      id: "jobTitle",
      name: "Job Title",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "company",
      name: "Company",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "companyLogo",
      name: "Company Logo",
      type: "Link",
      linkType: "Asset",
      required: false,
      localized: false,
    },
    {
      id: "dateRange",
      name: "Date Range",
      type: "Symbol",
      required: true,
      localized: false,
    },
    {
      id: "description",
      name: "Description",
      type: "RichText",
      required: false,
      localized: false,
    },
    {
      id: "tags",
      name: "Tags",
      type: "Array",
      required: false,
      localized: false,
      items: { type: "Symbol", validations: [] },
    },
    {
      id: "sortOrder",
      name: "Sort Order",
      type: "Integer",
      required: true,
      localized: false,
    },
  ];
}

run().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});

/**
 * Creates the networkEventsSection content type, uploads images, and creates the entry.
 * ONLY touches networkEventsSection — no other content types are modified.
 * Run: node scripts/setup-network-events.mjs
 */
import contentfulManagement from "contentful-management";
import { config } from "dotenv";
import fs from "fs";

config({ path: ".env.local" });

const client = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function uploadAsset(env, filePath, title, contentType, fileName) {
  console.log(`   Uploading ${fileName}...`);
  const upload = await env.createUpload({ file: fs.createReadStream(filePath) });

  let asset = await env.createAsset({
    fields: {
      title: { "en-US": title },
      file: {
        "en-US": {
          contentType,
          fileName,
          uploadFrom: {
            sys: { type: "Link", linkType: "Upload", id: upload.sys.id },
          },
        },
      },
    },
  });

  asset = await asset.processForAllLocales();
  await new Promise((r) => setTimeout(r, 3000));
  asset = await env.getAsset(asset.sys.id);
  asset = await asset.publish();
  console.log(`   Asset published: ${asset.sys.id}`);
  return asset;
}

async function run() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment("master");

  // 1. Create content type if it doesn't exist
  console.log("1. Setting up networkEventsSection content type...");
  let contentType;
  try {
    contentType = await env.getContentType("networkEventsSection");
    console.log("   Content type already exists, skipping creation.");
  } catch {
    contentType = await env.createContentTypeWithId("networkEventsSection", {
      name: "Network Events Section",
      displayField: "heading",
      fields: [
        {
          id: "heading",
          name: "Heading",
          type: "Symbol",
          required: true,
        },
        {
          id: "subheading",
          name: "Subheading",
          type: "Symbol",
          required: false,
        },
        {
          id: "images",
          name: "Images",
          type: "Array",
          required: false,
          items: {
            type: "Link",
            linkType: "Asset",
          },
        },
      ],
    });
    contentType = await contentType.publish();
    console.log("   Content type created and published.");
  }

  // 2. Upload images
  console.log("2. Uploading images...");
  const img1 = await uploadAsset(
    env,
    "c:/Users/kevin/Downloads/portfolio/marketing.PNG",
    "Marketing & Business Events – Group Photo",
    "image/png",
    "marketing-events.png"
  );
  const img2 = await uploadAsset(
    env,
    "c:/Users/kevin/Downloads/portfolio/Network.PNG",
    "Marketing & Business Events – Networking",
    "image/png",
    "network-events.png"
  );
  const img3 = await uploadAsset(
    env,
    "c:/Users/kevin/Downloads/portfolio/network-events.png",
    "Marketing & Business Events – Next Ten",
    "image/png",
    "next-ten-events.png"
  );

  // 3. Delete any existing entries of this type
  console.log("3. Creating entry...");
  const existing = await env.getEntries({ content_type: "networkEventsSection", limit: 10 });
  for (const entry of existing.items) {
    try {
      if (entry.sys.publishedVersion) await entry.unpublish();
      await entry.delete();
    } catch (err) {
      console.log(`   ⚠ Could not delete old entry: ${err.message}`);
    }
  }

  // 4. Create the entry
  const entry = await env.createEntry("networkEventsSection", {
    fields: {
      heading: { "en-US": "Network & Events" },
      subheading: { "en-US": "Marketing & Business Events" },
      images: {
        "en-US": [
          { sys: { type: "Link", linkType: "Asset", id: img1.sys.id } },
          { sys: { type: "Link", linkType: "Asset", id: img2.sys.id } },
          { sys: { type: "Link", linkType: "Asset", id: img3.sys.id } },
        ],
      },
    },
  });
  await entry.publish();
  console.log("   Entry created and published!");

  console.log("\n🎉 Done! networkEventsSection is ready.");
}

run().catch(console.error);

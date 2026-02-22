import contentfulManagement from "contentful-management";
import { config } from "dotenv";
import fs from "fs";

config({ path: ".env.local" });

const client = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

async function run() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment("master");

  const imgPath = "c:/Users/kevin/Downloads/portfolio/Author.PNG";

  if (!fs.existsSync(imgPath)) {
    console.error("❌ Image not found at:", imgPath);
    process.exit(1);
  }

  console.log("1. Uploading image to Contentful...");
  const upload = await env.createUpload({ file: fs.createReadStream(imgPath) });

  let asset = await env.createAsset({
    fields: {
      title: { "en-US": "Amazon Author Page – Angelica Rockford" },
      file: {
        "en-US": {
          contentType: "image/png",
          fileName: "author-page.png",
          uploadFrom: {
            sys: { type: "Link", linkType: "Upload", id: upload.sys.id },
          },
        },
      },
    },
  });

  asset = await asset.processForAllLocales();
  // Wait for processing
  await new Promise((r) => setTimeout(r, 3000));
  asset = await env.getAsset(asset.sys.id);
  asset = await asset.publish();
  console.log("   Asset published:", asset.sys.id);

  // Link to project entry
  console.log("2. Linking to project entry...");
  const entries = await env.getEntries({ content_type: "project", limit: 10 });
  const project = entries.items.find(
    (e) => e.fields.slug?.["en-US"] === "amazon-books-published"
  );

  if (!project) {
    console.error("❌ Could not find project with slug 'amazon-books-published'");
    process.exit(1);
  }

  project.fields.thumbnail = {
    "en-US": { sys: { type: "Link", linkType: "Asset", id: asset.sys.id } },
  };

  const updated = await project.update();
  await updated.publish();
  console.log("   Project thumbnail updated!");
  console.log("\n🎉 Done! The project now has the Amazon author page screenshot as its thumbnail.");
}

run().catch(console.error);

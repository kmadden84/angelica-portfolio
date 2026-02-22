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

  // Upload both images
  console.log("1. Uploading Toastmasters image...");
  const toastmasterAsset = await uploadAsset(
    env,
    "c:/Users/kevin/Downloads/portfolio/Toastmaster.PNG",
    "Toastmasters – Angelica Rockford",
    "image/png",
    "toastmasters.png"
  );

  console.log("2. Uploading Volleyball image...");
  const volleyballAsset = await uploadAsset(
    env,
    "c:/Users/kevin/Downloads/portfolio/Volleyball.PNG",
    "Recreational Volleyball & Tennis",
    "image/png",
    "volleyball.png"
  );

  // Get leadership activity entries
  console.log("3. Linking images to leadership entries...");
  const entries = await env.getEntries({
    content_type: "leadershipActivity",
    limit: 10,
  });

  for (const entry of entries.items) {
    const title = entry.fields.title?.["en-US"] || "";
    let asset = null;

    if (title.toLowerCase().includes("toastmaster")) {
      asset = toastmasterAsset;
    } else if (title.toLowerCase().includes("volleyball") || title.toLowerCase().includes("tennis")) {
      asset = volleyballAsset;
    }

    if (asset) {
      entry.fields.image = {
        "en-US": { sys: { type: "Link", linkType: "Asset", id: asset.sys.id } },
      };
      const updated = await entry.update();
      await updated.publish();
      console.log(`   ✓ Linked image to "${title}"`);
    }
  }

  console.log("\n🎉 Done! Both leadership activities now have images.");
}

run().catch(console.error);

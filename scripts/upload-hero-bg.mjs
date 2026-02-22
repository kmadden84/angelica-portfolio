import contentfulManagement from "contentful-management";
import { config } from "dotenv";
import https from "https";
import fs from "fs";
import path from "path";

config({ path: ".env.local" });

const client = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject);
  });
}

async function run() {
  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
  const env = await space.getEnvironment("master");

  // Download a subtle, professional background image
  const imgUrl = "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80";
  const imgPath = path.resolve("images/hero-bg.jpg");

  console.log("1. Downloading background image...");
  await download(imgUrl, imgPath);

  console.log("2. Uploading to Contentful...");
  let upload = await env.createUpload({ file: fs.createReadStream(imgPath) });

  let asset = await env.createAsset({
    fields: {
      title: { "en-US": "Hero Background" },
      file: {
        "en-US": {
          contentType: "image/jpeg",
          fileName: "hero-bg.jpg",
          uploadFrom: { sys: { type: "Link", linkType: "Upload", id: upload.sys.id } },
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

  // Link to heroSection entry
  console.log("3. Linking to heroSection...");
  const entries = await env.getEntries({ content_type: "heroSection", limit: 1 });
  let entry = entries.items[0];

  entry.fields.backgroundMedia = {
    "en-US": { sys: { type: "Link", linkType: "Asset", id: asset.sys.id } },
  };

  entry = await entry.update();
  entry = await entry.publish();
  console.log("   heroSection updated with backgroundMedia.");
  console.log("\nDone! Refresh the page to see the parallax background.");
}

run().catch(console.error);

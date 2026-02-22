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

  // A workspace/desk photo that will be visible behind the overlay
  const imgUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80";
  const imgPath = path.resolve("images/hero-bg2.jpg");

  console.log("1. Downloading new background...");
  await download(imgUrl, imgPath);

  console.log("2. Uploading to Contentful...");
  let upload = await env.createUpload({ file: fs.createReadStream(imgPath) });

  let asset = await env.createAsset({
    fields: {
      title: { "en-US": "Hero Background - Office" },
      file: {
        "en-US": {
          contentType: "image/jpeg",
          fileName: "hero-bg-office.jpg",
          uploadFrom: { sys: { type: "Link", linkType: "Upload", id: upload.sys.id } },
        },
      },
    },
  });

  asset = await asset.processForAllLocales();
  await new Promise((r) => setTimeout(r, 3000));
  asset = await env.getAsset(asset.sys.id);
  asset = await asset.publish();
  console.log("   Asset published:", asset.sys.id);

  console.log("3. Linking to heroSection...");
  const entries = await env.getEntries({ content_type: "heroSection", limit: 1 });
  let entry = entries.items[0];

  entry.fields.backgroundMedia = {
    "en-US": { sys: { type: "Link", linkType: "Asset", id: asset.sys.id } },
  };

  entry = await entry.update();
  entry = await entry.publish();
  console.log("Done! Refresh to see the new background.");
}

run().catch(console.error);

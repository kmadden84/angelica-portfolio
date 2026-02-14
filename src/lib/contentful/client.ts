import { createClient, type ContentfulClientApi } from "contentful";

let _client: ContentfulClientApi<undefined> | null = null;

export function getContentfulClient(): ContentfulClientApi<undefined> {
  if (_client) return _client;

  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;

  if (!spaceId || !accessToken) {
    throw new Error(
      "CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_TOKEN must be set"
    );
  }

  _client = createClient({
    space: spaceId,
    accessToken,
    environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
  });

  return _client;
}

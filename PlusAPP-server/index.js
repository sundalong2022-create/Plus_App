import { handleSiteRequest } from "./lib/site.mjs";

export default async function handler(req, res) {
  await handleSiteRequest(req, res);
}

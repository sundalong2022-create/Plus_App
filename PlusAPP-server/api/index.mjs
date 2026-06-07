import { handleRequest } from "../lib/app.mjs";

export default async function handler(req, res) {
  await handleRequest(req, res);
}

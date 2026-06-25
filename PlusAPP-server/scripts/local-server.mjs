import { createServer } from "node:http";
import { handleSiteRequest } from "../lib/site.mjs";

const PORT = Number(process.env.PORT || 8787);

const server = createServer(async (req, res) => {
  await handleSiteRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`PlusAPP server running at http://127.0.0.1:${PORT}`);
});

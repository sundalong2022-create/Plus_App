import { createServer } from "node:http";
import { handleRequest } from "../lib/app.mjs";

const PORT = Number(process.env.PORT || 8787);

const server = createServer(async (req, res) => {
  await handleRequest(req, res);
});

server.listen(PORT, () => {
  console.log(`PlusAPP server running at http://127.0.0.1:${PORT}`);
});

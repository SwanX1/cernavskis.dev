import { serveStatic } from "./util";

const staticProvider = serveStatic(new URL("../public/", import.meta.url), new Response("Not Found", { status: 404 }));

Bun.serve({
  port: 3000,
  fetch: staticProvider,
});
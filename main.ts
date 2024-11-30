import { initClientScripts, initCSS } from "./init.ts";
import { Hono } from "@hono/hono"
import { serveStatic } from "@hono/hono/deno"
import { logger } from "@hono/hono/logger"
import Home from "./templates/home.ts";
import { generateWikiPages, WikiPages } from "./wiki.ts";
import { initGameImageUrls } from "./suroi.ts";
import SearchResults from "./templates/searchResults.ts";

await initGameImageUrls();
await Promise.all([initCSS(), initClientScripts(), generateWikiPages()]);

const app = new Hono({ strict: false });

app.use("*", logger())
.get("/", (ctx) => {
  return ctx.html(Home());
}).get("/wiki/:page", (ctx) => {
  const { page } = ctx.req.param();
  const wikiPage = WikiPages.get(page);

  if (!wikiPage) return ctx.redirect("/404");

  return ctx.html(wikiPage.html);
}).post("/search", async (ctx) => {
  const formData = await ctx.req.formData();
  const query = formData.get("query")?.toString();
  return ctx.html(SearchResults(query));
}).get("/404", (ctx) => {
  ctx.status(404);
  return ctx.html(`404 Not Found`);
})



// Client scripts
app.get("/static/*", serveStatic({
  root: "./",
  rewriteRequestPath: (path) => path.replace("static", ".dist_client")
}))

// Game assets
app.get("/game-assets/*", serveStatic({
  root: "./",
  rewriteRequestPath: (path) => path.replace("game-assets", "suroi/client/public")
}))

// Public
app.get("/*", serveStatic({
  root: "./public"
}))

Deno.serve(app.fetch);
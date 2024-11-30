import Fuse from "fuse.js";
import { WikiPages } from "../wiki.ts";
import { html } from "@hono/hono/html";

const wikipages = Array.from(WikiPages.entries());

const fuse = new Fuse(wikipages.map(([_, info]) => info), { keys: ["title"] });

export default function SearchResults(query?: string) {
  return html`
    <div id="search-results" class="${query ? "flex-col" : "hidden"}">
      ${query ? fuse.search(query).slice(5).map(info => html`<div>${info.item.title}</div>`) : ""}
    </div>
  `;
}

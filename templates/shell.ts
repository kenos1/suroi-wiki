import { html } from "@hono/hono/html";
import Icon from "./icon.ts";

export default function Shell(props: {
  title: string
  favicon?: string
  children: ReturnType<typeof html>
}) {
  return html`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Suroi Wiki ${props.title}</title>
      <link rel="icon" type="image/x-icon" href="/favicon.ico">
      <link rel="stylesheet" href="/static/style.css">
      <script src="/static/htmx.js"></script>
    </head>
    <body>
      <div hx-boost="true">
        ${Navbar()}
        <div class="container mx-auto max-w-screen-lg p-4">
          ${props.children}
        </div>
      </div>
    </body>
    </html>
  `;
}

export function Navbar() {
  return html`
    <nav class="w-full p-4 bg-slate-50 flex flex-row gap-4">
      <a href="/">Suroi Wiki</a>
      <form class="flex flex-row" action="/search" method="GET">
        ${Icon("Search")}
        <input hx-post="/search" hx-target="#search-results" hx-swap="outerHTML" hx-trigger="keyup changed delay:500ms" type="text" placeholder="Search here...">
        <div id="search-results" class="hidden"></div>
      </form>
    </nav>
  `
}
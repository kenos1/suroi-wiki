import { html, raw } from "@hono/hono/html";
import Shell from "./shell.ts";

export type WikiPageProps = {
  title: string;
  children: string;
};

export default function WikiPage(props: WikiPageProps) {
  return Shell({
    title: "| " + props.title,
    children: html`
      <article class="prose">
        <h1>${props.title}</h1>
        ${raw(props.children)}
      </article>
    `
  });
}

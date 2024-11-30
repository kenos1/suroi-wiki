import { html } from "@hono/hono/html";
import WikiPage from "./templates/wikipage.ts";
import { walk, type WalkEntry } from "@std/fs";
import * as yaml from "@std/yaml";
import { Marked } from "marked";
import * as v from "@valibot/valibot";
import Handlebars from "handlebars";
import GunSidebar from "./templates/sidebars/gunSidebar.ts";

export const WikiPages: Map<string, {
    html: ReturnType<typeof html>
    title: string
}> = new Map();

export const Helpers: Record<string, Handlebars.HelperDelegate> = {
    gunSidebar: GunSidebar
}

export const WikiPageSchema = v.object({
    title: v.string()
})

const marked = new Marked({
    async: true,
    gfm: true,
});

export async function generateWikiPages() {
  for (const helper of Object.entries(Helpers)) Handlebars.registerHelper(helper[0], helper[1])

  const files = walk("wiki");

  for await (const file of files) {
    generateWikiPage(file);
  }
}

export async function generateWikiPage(file: WalkEntry) {
  if (!file.isFile) return;
  if (!file.name.endsWith(".md")) return;

  const route = file.name.split(".").slice(0, -1).join(".");

  const processedMarkdown = await processMarkdown(file, WikiPageSchema as unknown as v.AnySchema);

  WikiPages.set(
    route,
    {
        title: processedMarkdown.props.title,
        html: WikiPage({
          title: processedMarkdown.props.title,
          children: processedMarkdown.content,
        }),
    }
  );
}

export async function processMarkdown<T extends v.AnySchema>(file: WalkEntry, validator?: T): Promise<{
    props?: v.InferOutput<T>,
    content: string
}> {
    const templatedText = await Deno.readTextFile(file.path);

    const template = Handlebars.compile(templatedText);

    const text = template({});

    console.log(text)

    let props: v.InferOutput<T> = undefined;
    if (text.slice(0, "---".length) === "---") {
        const yamlSection = text.split("---").map(t => t.trim())[1];
        const parsedYaml = yaml.parse(yamlSection);
        if (validator) v.parse(validator, parsedYaml);

        props = parsedYaml;
    }

    const markdown = props ? text.split("---").slice(2).join("---").trim() : text
    const content = await marked.parse(markdown);

    return {
        props,
        content
    }
}
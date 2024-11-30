import { CONFIG } from "./config.ts";
import { exists } from "@std/fs";
import { build } from "esbuild";

export const submoduleDir = CONFIG.gitSubmoduleUrl.split("/").at(-1)?.split(".").slice(0, -1).join(".");

export async function initSubmodule() {
  if (!submoduleDir) throw new Error(`Invalid git submodule url: ${CONFIG.gitSubmoduleUrl}`);
  if (await exists(submoduleDir, { isDirectory: true })) {
    console.log("Submodule already initialized.");
    return;
  }

  console.log("Initializing git submodule...");

  const command = new Deno.Command("git", {
    args: ["clone", CONFIG.gitSubmoduleUrl, "--depth=1"],
  });

  const { success } = await command.output();

  if (!success) throw new Error(`Git submodule failed to initialize`);
}

export async function initCSS() {
  console.log("Building tailwindcss...");

  const command = new Deno.Command("deno", {
    args: [
      "run",
      "-A",
      "--allow-scripts",
      "npm:@tailwindcss/cli@next",
      "--minify",
      "--input",
      "style.css",
      "--output",
      ".dist_client/style.css",
    ]
  });

  const { success } = await command.output();

  if (!success) throw new Error(`Tailwindcss failed to build!`);

  console.log("Built tailwindcss")
}

export async function initClientScripts() {
  if (!(await exists(".dist_client", { isDirectory: true }))) await Deno.mkdir(".dist_client");

  console.log("Building client scripts...");

  const files = Deno.readDir("client");

  for await (const file of files) {
    if (!file.isFile) return;
    if (!file.name.endsWith(".ts")) return;

    await build({
      entryPoints: [`client/${file.name}`],
      outdir: ".dist_client",
      bundle: true,
      minify: true,
    });
  }

  console.log("Client scripts built");
}

await initSubmodule();
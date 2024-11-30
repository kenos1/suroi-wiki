import { html } from "@hono/hono/html";
import Shell from "./shell.ts";

export default function Home() {
    return Shell({
        title: "",
        children: html`<h1>Welcome to the new suroi wiki!</h1>`
    })
}
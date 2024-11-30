import { html } from "@hono/hono/html";
import { ReferenceTo } from "../../suroi/common/src/utils/objectDefinitions.ts"
import { Guns, type GunDefinition } from "../../suroi/common/src/definitions/guns.ts"
import { getSuroiGameImageUrl } from "../../suroi.ts";

export default function GunSidebar(gun: ReferenceTo<typeof Guns>) {
    const def = Guns.reify(gun) as GunDefinition;
    return html`<div class="float-right bg-slate-200">
        <h1>${def.name}</h1>
        <img src="${getSuroiGameImageUrl(def.idString)}">
    </div>`
}
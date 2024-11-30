import { walk } from "@std/fs";
import { CONFIG } from "./config.ts";
import { submoduleDir } from "./init.ts";

const SuroiGameImageUrls: Map<string, string> = new Map();

export async function initGameImageUrls() {
  if (!submoduleDir) throw new Error(`Invalid git submodule url: ${CONFIG.gitSubmoduleUrl}`);
  const gameImageFiles = walk(submoduleDir + "/client/public/img/game");

  for await (const gameImageFile of gameImageFiles) {
    if (!gameImageFile.isFile) continue;
    if (!gameImageFile.name.endsWith(".svg")) continue;

    const frame = gameImageFile.name.split(".").slice(0, -1).join(".");

    SuroiGameImageUrls.set(frame, gameImageFile.path.replace("suroi/client/public", "/game-assets"))
  }
}

export function getSuroiGameImageUrl(frame: string) {
    return SuroiGameImageUrls.get(frame) ?? "/game-assets/img/game/shared/_missing_texture.svg";
}
import { raw } from "@hono/hono/utils/html";
import * as lucide from "lucide-static"

export default function Icon(name: keyof typeof lucide) {
    return raw(lucide[name]);
}
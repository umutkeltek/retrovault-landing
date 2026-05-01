import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const html = read("index.html");
const css = read("styles.css");
const js = read("script.js");
const cname = read("CNAME").trim();
const robots = read("robots.txt");
const sitemap = read("sitemap.xml");
const combined = `${html}\n${css}\n${js}`;

for (const required of [
  "RetroVault",
  "$4.99/month",
  "$24.99/year",
  "$39.99 lifetime",
  "7-day free trial",
  "No ROMs are included",
  "legally owned",
  "https://retrovault.keltek.ai/privacy",
  "https://retrovault.keltek.ai/terms",
  "https://retrovault.keltek.ai/help",
  "https://github.com/umutkeltek/mgba-retrovault",
  "mGBA source offer",
  "App Store"
]) {
  assert(combined.includes(required), `Missing required launch content: ${required}`);
}

for (const forbidden of [
  "$29.99",
  "$19.99",
  "pro.annual.intro",
  "free ROM",
  "download games",
  "Nintendo",
  "Game Boy",
  "Pokemon",
  "Mario",
  "Zelda"
]) {
  assert(!combined.toLowerCase().includes(forbidden.toLowerCase()), `Forbidden copy present: ${forbidden}`);
}

assert(html.includes("<canvas"), "Hero must include a canvas visual asset");
assert(html.includes('id="heroScene"'), "Hero canvas must have a stable id");
assert(css.includes("@media"), "Styles must include responsive media queries");
assert(css.includes("prefers-reduced-motion"), "Styles must respect reduced motion");
assert(js.includes("requestAnimationFrame"), "Hero scene must animate when motion is allowed");
assert(js.includes("matchMedia(\"(prefers-reduced-motion: reduce)\")"), "JS must respect reduced motion");
assert(cname === "retrovault.keltek.ai", "CNAME must point to the launch domain");
assert(robots.includes("Sitemap: https://retrovault.keltek.ai/sitemap.xml"), "robots.txt must advertise sitemap");
assert(sitemap.includes("<loc>https://retrovault.keltek.ai/</loc>"), "sitemap must include canonical home URL");

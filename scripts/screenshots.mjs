// Screenshots of routes at 1440×900 and 390×844 in light and dark mode.
// Usage: node scripts/screenshots.mjs [baseUrl] [outDir] [route ...]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [base = "http://localhost:3000", out = "screenshots", ...routes] = process.argv.slice(2);
const targets = routes.length ? routes : ["/"];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const vp of viewports) {
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: vp, colorScheme: scheme, deviceScaleFactor: 1 });
    // The app defaults to light; dark mode is the user's stored choice (next-themes).
    await ctx.addInitScript((t) => localStorage.setItem("theme", t), scheme);
    const page = await ctx.newPage();
    for (const route of targets) {
      await page.goto(base + route, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(600);
      const slug = route.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "") || "dnes";
      await page.screenshot({ path: `${out}/${slug}.${vp.name}.${scheme}.png` });
    }
    await ctx.close();
  }
}
await browser.close();

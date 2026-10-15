// Captures the Phase 1 composition study at the three review viewports, plus a
// text-free crop of the hero safe zone for contrast measurement
// (scripts/art/measure_safe_zone.py).
// Usage: start `npm run dev -- --port 3100`, then `npm run capture:composition`.
// Set STUDY_URL to use a different origin.

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const origin = process.env.STUDY_URL ?? "http://localhost:3100";
const outDir = path.resolve("docs/verification/phase-1");
const measureDir = path.resolve("test-results/phase-1-safe-zone");

const candidates = ["a", "b", "c"];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1280, height: 720 },
  { name: "mobile", width: 390, height: 844 },
];
const shots = [
  ...viewports.map((viewport) => ({ viewport, mode: "guides" })),
  { viewport: viewports[0], mode: "clean" },
];

await mkdir(outDir, { recursive: true });
await mkdir(measureDir, { recursive: true });
const browser = await chromium.launch();

async function open(viewport, url) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.name === "mobile" ? 2 : 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0));
  return { context, page };
}

for (const id of candidates) {
  for (const { viewport, mode } of shots) {
    const { context, page } = await open(viewport, `${origin}/lab/composition/${id}/${mode}`);
    const file = path.join(outDir, `candidate-${id}-${viewport.name}-${mode}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 82 });
    console.log("captured", path.relative(process.cwd(), file));
    await context.close();
  }

  for (const viewport of viewports) {
    const { context, page } = await open(viewport, `${origin}/lab/composition/${id}/clean`);
    await page.addStyleTag({
      content: "[data-safe-zone], [data-safe-zone] * { color: transparent !important; border-color: transparent !important; }",
    });
    const zone = page.locator("[data-safe-zone]");
    await zone.screenshot({ path: path.join(measureDir, `candidate-${id}-${viewport.name}.png`) });
    await context.close();
  }
}

await browser.close();

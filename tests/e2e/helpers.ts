import type { Browser, BrowserContextOptions, Page } from "@playwright/test";

export const viewports = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  laptop: { width: 1280, height: 720, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2 },
} as const;

export type ViewportName = keyof typeof viewports;
export type Motion = "default" | "reduced";

export const verificationDir = "docs/verification/milestone-1";

export async function openPage(
  browser: Browser,
  viewport: ViewportName,
  motion: Motion,
  path = "/",
  options: BrowserContextOptions = {},
) {
  const { width, height, deviceScaleFactor } = viewports[viewport];
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor,
    reducedMotion: motion === "reduced" ? "reduce" : "no-preference",
    ...options,
  });
  const page = await context.newPage();
  await page.goto(path);
  return { context, page };
}

/** Fonts loaded, images decoded, and entrance animations finished. */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((img) => (img.complete ? null : img.decode().catch(() => null))),
    );
    await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => null)));
  });
}

/** Presses Tab until the focused element matches, or fails after a bound. */
export async function tabTo(page: Page, selector: string, maxPresses = 40) {
  for (let i = 0; i < maxPresses; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return;
  }
  throw new Error(`Could not reach ${selector} with Tab`);
}

import type { Browser, BrowserContextOptions, Page } from "@playwright/test";

export const viewports = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  laptop: { width: 1280, height: 720, deviceScaleFactor: 1 },
  compact: { width: 1024, height: 768, deviceScaleFactor: 1 },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 1 },
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

/**
 * Effects that reduced motion forbids: keyframe or script animations, transitions of geometry
 * (transform, position, size), and any transition longer than 120ms. Short color, opacity,
 * and filter transitions are permitted and not reported.
 */
export function forbiddenMotion(page: Page) {
  return page.evaluate(() =>
    document.getAnimations().flatMap((animation) => {
      if (!(animation instanceof CSSTransition)) {
        const name = animation instanceof CSSAnimation ? animation.animationName : "script";
        return [`animation ${name}`];
      }
      const property = animation.transitionProperty;
      const duration = Number(animation.effect?.getComputedTiming().duration ?? 0);
      if (/^(transform|translate|scale|rotate|top|left|right|bottom|inset.*|margin.*|(min-|max-)?(width|height))$/.test(property)) {
        return [`movement transition ${property}`];
      }
      return duration > 120 ? [`${duration}ms transition ${property}`] : [];
    }),
  );
}

/** Presses Tab until the focused element matches, or fails after a bound. */
export async function tabTo(page: Page, selector: string, maxPresses = 40) {
  for (let i = 0; i < maxPresses; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate((s) => document.activeElement?.matches(s) ?? false, selector)) return;
  }
  throw new Error(`Could not reach ${selector} with Tab`);
}

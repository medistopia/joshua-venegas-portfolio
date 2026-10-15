import type { Browser, BrowserContextOptions, Page } from "@playwright/test";

export const viewports = {
  wide: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  laptop: { width: 1280, height: 720, deviceScaleFactor: 1 },
  compact: { width: 1024, height: 768, deviceScaleFactor: 1 },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2 },
} as const;

export type ViewportName = keyof typeof viewports;
export type Motion = "default" | "reduced";

export const verificationDir = "docs/verification/lobby";

/** Every view in the shell, keyed by the name used in screenshot and report files. */
export const views = {
  home: "/",
  projects: "/projects",
  "project-hermes": "/projects/project-hermes",
  experience: "/experience",
  about: "/about",
  contact: "/contact",
} as const;

export type ViewName = keyof typeof views;

export async function openPage(
  browser: Browser,
  viewport: ViewportName,
  motion: Motion,
  path = "/",
  { clock = false, ...options }: BrowserContextOptions & { clock?: boolean } = {},
) {
  const { width, height, deviceScaleFactor } = viewports[viewport];
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor,
    reducedMotion: motion === "reduced" ? "reduce" : "no-preference",
    ...options,
  });
  const page = await context.newPage();
  // A fake clock keeps real time until a test pauses or advances it.
  if (clock) await page.clock.install();
  await page.goto(path);
  return { context, page };
}

/** Stops page timers, and with them the carousel's rotation. Needs a page opened with `clock`. */
export async function freezeTimers(page: Page) {
  // The page clock keeps running between reading it and pausing; retry if it has passed the target.
  for (let attempt = 1; ; attempt++) {
    try {
      await page.clock.pauseAt(await page.evaluate(() => Date.now() + 250));
      return;
    } catch (error) {
      if (attempt === 5) throw error;
    }
  }
}

/** Active tab revealed, fonts loaded, images decoded, and entrance animations finished. */
export async function settle(page: Page) {
  // The tabs stream in behind a Suspense boundary (usePathname under Cache Components).
  await page.waitForSelector("header [aria-current='page']", { state: "attached" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Full-page captures include distant project thumbnails. Explicitly request lazy images
    // before decoding them; otherwise a long article can leave decode() pending offscreen.
    for (const img of document.images) img.loading = "eager";
    await Promise.all(
      Array.from(document.images).map((img) => img.decode()),
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

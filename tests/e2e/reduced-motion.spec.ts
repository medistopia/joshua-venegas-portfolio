import { expect, test, type Page } from "@playwright/test";
import { forbiddenMotion, openPage, settle, tabTo } from "./helpers";

const interactive = [
  "header nav a[href='/projects']",
  "main a[href='/contact']",
  "a[href='/projects/project-hermes']",
  "main a[href='/projects'] >> nth=0",
  "main nav[aria-label='Sections'] a[href='/about']",
];

/** Rendered boxes of an element and its descendants; any lift, slide, or zoom changes them. */
function motionState(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((el) =>
    [el, ...Array.from(el.querySelectorAll("*"))].map((node) => {
      const r = node.getBoundingClientRect();
      return [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 10) / 10).join(",");
    }),
  );
}

function maxTransitionMs(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((el) => {
    const toMs = (v: string) => (v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
    let max = 0;
    for (const node of [el, ...Array.from(el.querySelectorAll("*"))]) {
      for (const d of getComputedStyle(node).transitionDuration.split(",")) max = Math.max(max, toMs(d.trim()));
    }
    return max;
  });
}

function clipPaths(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("body *"))
      .map((el) => getComputedStyle(el).clipPath)
      .filter((value) => value !== "none" && value !== "inset(50%)"),
  );
}

const layoutTargets = [
  "h1",
  "a[href='/projects/project-hermes']",
  "a[href='/projects/recolm']",
  "a[href='/projects/valorant-ml']",
  "main a[href='/projects'] >> nth=0",
  "main nav[aria-label='Sections']",
];

function layout(page: Page) {
  return Promise.all(
    layoutTargets.map(async (selector) => {
      const box = await page.locator(selector).first().boundingBox();
      return box && [box.x, box.y, box.width, box.height].map((n) => Math.round(n * 2) / 2);
    }),
  );
}

test.describe("reduced motion", () => {
  test("no animations or movement run after load", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "reduced");
    expect(await forbiddenMotion(page)).toEqual([]);
    await context.close();
  });

  test("a pointer resting on the brand slab only triggers its short brightness transition", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "reduced");
    await page.mouse.move(20, 20);
    await page.mouse.move(24, 24);
    expect(await forbiddenMotion(page)).toEqual([]);
    await context.close();
  });

  test("hover and focus leave transforms unchanged and transitions at 120ms or less", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "reduced");
    await settle(page);
    for (const selector of interactive) {
      const rest = await motionState(page, selector);
      await page.locator(selector).first().hover();
      await page.waitForTimeout(250);
      expect(await motionState(page, selector), `${selector} on hover`).toEqual(rest);
      expect(await maxTransitionMs(page, selector), `${selector} transition`).toBeLessThanOrEqual(120);
      await page.mouse.move(5, 895);
    }

    await page.mouse.move(5, 895);
    const hermes = "a[href='/projects/project-hermes']";
    await page.waitForTimeout(250);
    const rest = await motionState(page, hermes);
    await tabTo(page, hermes);
    await page.waitForTimeout(250);
    expect(await motionState(page, hermes), "card on focus").toEqual(rest);
    await context.close();
  });

  test("mobile menu opens without movement", async ({ browser }) => {
    const { context, page } = await openPage(browser, "mobile", "reduced");
    await settle(page);
    await page.getByRole("button", { name: "Menu" }).click();
    expect(await forbiddenMotion(page)).toEqual([]);
    expect(await maxTransitionMs(page, "dialog")).toBeLessThanOrEqual(120);
    await context.close();
  });

  test("angled geometry and layout match the default-motion final state", async ({ browser }) => {
    const reduced = await openPage(browser, "desktop", "reduced");
    const full = await openPage(browser, "desktop", "default");
    await settle(reduced.page);
    await settle(full.page);

    const reducedClips = await clipPaths(reduced.page);
    expect(reducedClips.length).toBeGreaterThan(5);
    expect(reducedClips).toEqual(await clipPaths(full.page));
    expect(await layout(reduced.page)).toEqual(await layout(full.page));

    await reduced.context.close();
    await full.context.close();
  });
});

test.describe("default motion", () => {
  test("entrance sequence finishes within one second", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    const endTimes = await page.evaluate(() => {
      const toMs = (v: string) => (v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
      return Array.from(document.querySelectorAll("body *"))
        .map((el) => getComputedStyle(el))
        .filter((s) => s.animationName !== "none")
        .map((s) => toMs(s.animationDelay) + toMs(s.animationDuration));
    });
    expect(endTimes.length).toBeGreaterThan(0);
    expect(Math.max(...endTimes)).toBeLessThanOrEqual(1000);
    await context.close();
  });

  test("content is readable with JavaScript disabled", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default", "/", { javaScriptEnabled: false });
    await page.waitForTimeout(1200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("main ol > li")).toHaveCount(3);
    const opacities = await page.locator("main ol > li").evaluateAll((items) =>
      items.map((item) => getComputedStyle(item).opacity),
    );
    expect(opacities).toEqual(["1", "1", "1"]);
    await context.close();
  });
});

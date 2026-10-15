import { mkdirSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { forbiddenMotion, openPage, settle } from "./helpers";

const output = "docs/verification/motion-pilot";
mkdirSync(output, { recursive: true });

test("lobby hierarchy is staggered, readable at its start and interruptible by focus", async ({ browser }) => {
  const { context, page } = await openPage(browser, "desktop", "default");
  await settle(page);
  const timings = await page.locator(".lobby .animate-rise").evaluateAll((elements) => elements.map((el) => {
    const css = getComputedStyle(el);
    return { delay: parseFloat(css.animationDelay), duration: parseFloat(css.animationDuration) };
  }));
  expect(timings).toHaveLength(7);
  expect(timings.map((t) => Math.round(t.delay * 1000))).toEqual([0, 60, 120, 180, 180, 240, 300]);
  expect(Math.max(...timings.map((t) => t.delay + t.duration))).toBeLessThanOrEqual(0.8);
  // Restart and sample the actual CSS animation at its earliest point, independent of machine speed.
  await page.locator(".lobby .animate-rise").evaluateAll((elements) => {
    for (const el of elements) {
      for (const animation of el.getAnimations()) animation.cancel();
      (el as HTMLElement).style.animationName = "none";
    }
    void document.body.offsetHeight;
    for (const el of elements) (el as HTMLElement).style.removeProperty("animation-name");
    void document.body.offsetHeight;
    for (const el of elements) for (const animation of el.getAnimations()) { animation.pause(); animation.currentTime = 0; }
  });
  const opacity = await page.locator(".lobby .animate-rise").evaluateAll((els) => els.map((el) => Number(getComputedStyle(el).opacity)));
  expect(opacity.every((value) => value >= 0.92)).toBe(true);
  await page.locator("[data-pennant='project-hermes']").focus();
  await expect(page.locator("[data-pennant='project-hermes']")).toBeFocused();
  expect(await page.locator(".lobby-pennant").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await context.close();
});

for (const motion of ["default", "reduced"] as const) {
  test(`Projects entry, rapid navigation and history: ${motion}`, async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", motion);
    await settle(page);
    await page.evaluate(() => {
      const state = window as typeof window & { pilotEvents: string[]; shellNodes: Element[] };
      state.pilotEvents = [];
      state.shellNodes = [document.querySelector("header")!, document.querySelector("aside")!];
      document.addEventListener("animationstart", (e) => state.pilotEvents.push((e as AnimationEvent).animationName));
    });
    const projects = page.locator("header nav[aria-label='Primary']:visible a[href='/projects']");
    await projects.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Select a project" })).toBeVisible();
    if (motion === "default") {
      await expect.poll(() => page.evaluate(() => (window as typeof window & { pilotEvents: string[] }).pilotEvents)).toContain("view-enter");
      // Hold the real transition midway, then navigate while it is still active.
      await page.locator(".motion-projects:visible").evaluate((el) => {
        (el as HTMLElement).style.animationName = "none";
        void document.body.offsetHeight;
        (el as HTMLElement).style.removeProperty("animation-name");
        void document.body.offsetHeight;
        for (const animation of el.getAnimations()) { animation.pause(); animation.currentTime = 80; }
      });
      expect(await page.locator(".motion-projects:visible").evaluate((el) => el.getAnimations().some((a) => a.playState === "paused" && a.currentTime === 80))).toBe(true);
    } else {
      expect(await forbiddenMotion(page)).toEqual([]);
    }
    await page.locator("header nav[aria-label='Primary']:visible a[href='/about']").click();
    await expect(page).toHaveURL(/\/about$/);
    await page.locator("header nav[aria-label='Primary']:visible a[href='/projects']").click();
    await expect(page).toHaveURL(/\/projects$/);
    await settle(page);
    await expect(page.locator("main h1:visible")).toHaveCount(1);
    await expect(page.locator("[data-pennant]:visible")).toHaveCount(5);
    await expect(projects).toHaveAttribute("aria-current", "page");
    expect(await page.evaluate(() => {
      const state = window as typeof window & { shellNodes: Element[] };
      return state.shellNodes.every((el) => el.isConnected && getComputedStyle(el).animationName === "none");
    })).toBe(true);
    await page.goBack();
    await expect(page).toHaveURL(/\/about$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/projects$/);
    await settle(page);
    await expect(page.locator("main h1:visible")).toHaveCount(1);
    if (motion === "reduced") expect(await forbiddenMotion(page)).toEqual([]);
    await context.close();
  });

  test(`record pilot and case study: ${motion}`, async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", motion, "/", {
      recordVideo: { dir: `${output}/recordings`, size: { width: 1440, height: 900 } },
    });
    const video = page.video()!;
    await settle(page);
    await page.screenshot({ path: `${output}/lobby-${motion}.jpg`, quality: 85 });
    await page.locator("header nav[aria-label='Primary']:visible a[href='/projects']").click();
    await expect(page.getByRole("heading", { name: "Select a project" })).toBeVisible();
    await settle(page);
    await page.screenshot({ path: `${output}/projects-${motion}.jpg`, quality: 85 });
    await page.locator("main [data-pennant='project-hermes']:visible").click();
    await expect(page.getByRole("heading", { name: "Project Hermes", exact: true })).toBeVisible();
    await settle(page);
    const reader = page.getByRole("article");
    await expect(reader.getByRole("heading", { level: 2 })).toHaveCount(10); // nine narrative sections and Stack
    await reader.focus();
    await page.keyboard.press("End");
    await expect(page.getByRole("heading", { name: "Next steps" })).toBeInViewport();
    await expect(page.locator("header nav[aria-label='Primary']:visible")).toBeInViewport();
    await page.screenshot({ path: `${output}/hermes-end-${motion}.jpg`, quality: 85 });
    await context.close();
    await video.saveAs(`${output}/pilot-${motion}.webm`);
    await video.delete();
    writeFileSync(`${output}/browser-${motion}.json`, JSON.stringify({ browser: `Chromium ${browser.version()}`, motion }, null, 2) + "\n");
  });
}

test("Hermes narrative and native navigation work without JavaScript", async ({ browser }) => {
  const { context, page } = await openPage(browser, "mobile", "reduced", "/projects/project-hermes", { javaScriptEnabled: false });
  await expect(page.getByRole("heading", { name: "Decision 3: show the destination, then recheck it" })).toBeVisible();
  await page.getByRole("link", { name: "All projects", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Select a project" })).toBeVisible();
  await context.close();
});

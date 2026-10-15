import { expect, test, type Browser, type Page } from "@playwright/test";
import { forbiddenMotion, freezeTimers, settle, tabTo, viewports, type Motion, type ViewportName } from "./helpers";

const ROTATION_MS = 8000;

/**
 * Opens the lobby on a fake clock and pauses it once settled, so a test advances time itself.
 * Every pending rotation timer is tracked so tests can see when the next change is due and that
 * paused states leave no timer behind.
 */
async function open(browser: Browser, viewport: ViewportName, motion: Motion) {
  const { width, height, deviceScaleFactor } = viewports[viewport];
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor,
    reducedMotion: motion === "reduced" ? "reduce" : "no-preference",
  });
  await context.clock.install();
  await context.addInitScript((rotationMs) => {
    const due = new Map<number, number>();
    const set = window.setTimeout.bind(window);
    const clear = window.clearTimeout.bind(window);
    window.setTimeout = ((handler: TimerHandler, ms?: number, ...args: unknown[]) => {
      if (ms !== rotationMs || typeof handler !== "function") return set(handler, ms, ...args);
      const id = set(() => {
        due.delete(id);
        handler(...args);
      }, ms);
      due.set(id, Date.now() + ms);
      return id;
    }) as typeof window.setTimeout;
    window.clearTimeout = ((id?: number) => {
      if (id !== undefined) due.delete(id);
      clear(id);
    }) as typeof window.clearTimeout;
    Object.assign(window, { rotationTimers: () => [...due.values()].map((at) => at - Date.now()) });
  }, ROTATION_MS);
  const page = await context.newPage();
  await page.goto("/");
  await settle(page);
  await freezeTimers(page);
  return { context, page };
}

/** Milliseconds until each pending rotation timer fires. */
function timers(page: Page) {
  return page.evaluate(() => (window as unknown as { rotationTimers: () => number[] }).rotationTimers());
}

function parts(page: Page) {
  const carousel = page.locator("[aria-roledescription='carousel']");
  return {
    carousel,
    active: carousel.locator("[aria-roledescription='slide']:not([inert])"),
    live: carousel.locator("[aria-live='polite']"),
    toggle: carousel.getByRole("button", { name: /automatic rotation/ }),
  };
}

const away = (page: Page) => page.mouse.move(5, page.viewportSize()!.height - 5);

test.describe("carousel rotation", () => {
  test("advances every eight seconds, wraps, and does not announce automatic changes", async ({ browser }) => {
    const { context, page } = await open(browser, "desktop", "default");
    const { carousel, active, live, toggle } = parts(page);
    await expect(toggle).toHaveAccessibleName("Pause automatic rotation");
    await expect(toggle).toHaveText("Pause");
    await expect(active).toHaveAttribute("data-slide", "project-hermes");

    const [remaining] = await timers(page);
    expect(remaining).toBeGreaterThan(0);
    expect(remaining).toBeLessThanOrEqual(ROTATION_MS);
    // The first timer started while the clock ran in real time, so its due moment is fractional.
    await page.clock.runFor(remaining - 10);
    await page.waitForTimeout(100);
    await expect(active).toHaveAttribute("data-slide", "project-hermes");

    await page.clock.runFor(20);
    await expect(active).toHaveAttribute("data-slide", "wei-research");
    await expect(carousel.getByRole("button", { name: "Show Research" })).toHaveAttribute("aria-current", "true");
    await expect(carousel.locator("[data-slide='project-hermes']")).toHaveAttribute("inert", "");
    await expect(live).toHaveText("");

    await expect.poll(() => timers(page)).toEqual([ROTATION_MS]);
    await page.clock.runFor(ROTATION_MS);
    await expect(active).toHaveAttribute("data-slide", "project-hermes");
    await expect(live).toHaveText("");
    await context.close();
  });

  test("the pointer over the carousel holds rotation, and leaving resumes it", async ({ browser }) => {
    const { context, page } = await open(browser, "desktop", "default");
    const { carousel, active } = parts(page);
    await carousel.hover();
    await expect(carousel).toHaveAttribute("data-rotating", "false");
    await expect.poll(() => timers(page)).toEqual([]);
    await page.clock.runFor(ROTATION_MS * 3);
    await expect(active).toHaveAttribute("data-slide", "project-hermes");

    await away(page);
    await expect(carousel).toHaveAttribute("data-rotating", "true");
    await expect.poll(() => timers(page)).toEqual([ROTATION_MS]);
    await page.clock.runFor(ROTATION_MS);
    await expect(active).toHaveAttribute("data-slide", "wei-research");
    await context.close();
  });

  test("keyboard focus inside holds rotation, the toggle works from the keyboard, and leaving resumes", async ({ browser }) => {
    const { context, page } = await open(browser, "desktop", "default");
    const { carousel, active, toggle } = parts(page);
    await tabTo(page, "[aria-roledescription='carousel'] a[href='/projects/project-hermes']");
    await expect(carousel).toHaveAttribute("data-rotating", "false");
    await expect.poll(() => timers(page)).toEqual([]);
    await page.clock.runFor(ROTATION_MS * 3);
    await expect(active).toHaveAttribute("data-slide", "project-hermes");

    await tabTo(page, "[aria-roledescription='carousel'] button[aria-label$='automatic rotation']", 6);
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAccessibleName("Play automatic rotation");
    await expect(toggle).toHaveText("Play");
    await page.keyboard.press("Space");
    await expect(toggle).toHaveAccessibleName("Pause automatic rotation");
    await expect(carousel).toHaveAttribute("data-rotating", "false");

    // The toggle is the carousel's last stop; the next Tab leaves it.
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement?.closest("[aria-roledescription='carousel']") ?? null)).toBeNull();
    await expect(carousel).toHaveAttribute("data-rotating", "true");
    await expect.poll(() => timers(page)).toEqual([ROTATION_MS]);
    await page.clock.runFor(ROTATION_MS);
    await expect(active).toHaveAttribute("data-slide", "wei-research");
    await context.close();
  });

  test("Pause stops rotation until Play is pressed", async ({ browser }) => {
    const { context, page } = await open(browser, "desktop", "default");
    const { carousel, active, live, toggle } = parts(page);
    await toggle.click();
    await away(page);
    await expect(toggle).toHaveAccessibleName("Play automatic rotation");
    await expect(carousel).toHaveAttribute("data-rotating", "false");
    await expect.poll(() => timers(page)).toEqual([]);
    await page.clock.runFor(ROTATION_MS * 3);
    await expect(active).toHaveAttribute("data-slide", "project-hermes");

    await toggle.click();
    await away(page);
    await expect(toggle).toHaveAccessibleName("Pause automatic rotation");
    await expect.poll(() => timers(page)).toEqual([ROTATION_MS]);
    await page.clock.runFor(ROTATION_MS);
    await expect(active).toHaveAttribute("data-slide", "wei-research");
    await expect(live).toHaveText("");
    await context.close();
  });

  test("choosing a slide stops rotation until Play and announces the slide", async ({ browser }) => {
    const { context, page } = await open(browser, "desktop", "default");
    const { carousel, active, live, toggle } = parts(page);

    await carousel.getByRole("button", { name: "Next item" }).click();
    await away(page);
    await expect(active).toHaveAttribute("data-slide", "wei-research");
    await expect(live).toHaveText("Slide 2 of 2: Research");
    await expect(toggle).toHaveAccessibleName("Play automatic rotation");
    await expect.poll(() => timers(page)).toEqual([]);
    await page.clock.runFor(ROTATION_MS * 3);
    await expect(active).toHaveAttribute("data-slide", "wei-research");

    await carousel.getByRole("button", { name: "Show Project Hermes" }).click();
    await expect(active).toHaveAttribute("data-slide", "project-hermes");
    await expect(live).toHaveText("Slide 1 of 2: Project Hermes");
    await carousel.getByRole("button", { name: "Previous item" }).click();
    await expect(active).toHaveAttribute("data-slide", "wei-research");
    await expect(live).toHaveText("Slide 2 of 2: Research");

    await toggle.click();
    await away(page);
    await expect(live).toHaveText("");
    await expect.poll(() => timers(page)).toEqual([ROTATION_MS]);
    await page.clock.runFor(ROTATION_MS);
    await expect(active).toHaveAttribute("data-slide", "project-hermes");
    await expect(live).toHaveText("");
    await context.close();
  });

  test("a hidden page holds rotation", async ({ browser }) => {
    const { context, page } = await open(browser, "desktop", "default");
    const { carousel, active } = parts(page);
    const setHidden = (hidden: boolean) =>
      page.evaluate((hidden) => {
        if (hidden) {
          Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
          Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
        } else {
          delete (document as { hidden?: boolean }).hidden;
          delete (document as { visibilityState?: string }).visibilityState;
        }
        document.dispatchEvent(new Event("visibilitychange"));
      }, hidden);

    await setHidden(true);
    await expect(carousel).toHaveAttribute("data-rotating", "false");
    await expect.poll(() => timers(page)).toEqual([]);
    await page.clock.runFor(ROTATION_MS * 3);
    await expect(active).toHaveAttribute("data-slide", "project-hermes");

    await setHidden(false);
    await expect(carousel).toHaveAttribute("data-rotating", "true");
    await expect.poll(() => timers(page)).toEqual([ROTATION_MS]);
    await page.clock.runFor(ROTATION_MS);
    await expect(active).toHaveAttribute("data-slide", "wei-research");
    await context.close();
  });

  test("reduced motion starts paused and changes slides without movement", async ({ browser }) => {
    const { context, page } = await open(browser, "desktop", "reduced");
    const { carousel, active, toggle } = parts(page);
    await expect(toggle).toHaveAccessibleName("Play automatic rotation");
    await expect(toggle).toHaveText("Play");
    await expect(carousel).toHaveAttribute("data-rotating", "false");
    expect(await timers(page)).toEqual([]);
    await page.clock.runFor(ROTATION_MS * 3);
    await expect(active).toHaveAttribute("data-slide", "project-hermes");

    await carousel.getByRole("button", { name: "Next item" }).click();
    await expect(active).toHaveAttribute("data-slide", "wei-research");
    expect(await forbiddenMotion(page)).toEqual([]);
    const slideTransition = await carousel
      .locator("[aria-roledescription='slide']")
      .first()
      .evaluate((el) => {
        const s = getComputedStyle(el);
        return { property: s.transitionProperty, duration: parseFloat(s.transitionDuration) * 1000 };
      });
    expect(slideTransition.property).toBe("opacity");
    expect(slideTransition.duration).toBeLessThanOrEqual(120);

    // Play is the visitor's explicit choice, so rotation runs even under reduced motion.
    await toggle.click();
    await away(page);
    await expect.poll(() => timers(page)).toEqual([ROTATION_MS]);
    await page.clock.runFor(ROTATION_MS);
    await expect(active).toHaveAttribute("data-slide", "project-hermes");
    expect(await forbiddenMotion(page)).toEqual([]);
    await context.close();
  });

  test("only the active slide is reachable by keyboard, on both slides", async ({ browser }) => {
    const { context, page } = await open(browser, "mobile", "default");
    const { carousel } = parts(page);
    // On mobile the Menu button is the last stop before the carousel.
    const stops = async () => {
      await page.getByRole("button", { name: "Menu" }).focus();
      const names: string[] = [];
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");
        const name = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el?.closest("[aria-roledescription='carousel']")) return null;
          return el.getAttribute("href") ?? el.getAttribute("aria-label") ?? "";
        });
        if (name === null) break;
        names.push(name);
      }
      return names;
    };

    const controls = ["Previous item", "Show Project Hermes", "Show Research", "Next item"];
    expect(await stops()).toEqual(["/projects/project-hermes", ...controls, "Pause automatic rotation"]);
    await expect(carousel.locator("[data-slide='wei-research']")).toHaveAttribute("inert", "");

    await carousel.getByRole("button", { name: "Show Research" }).click();
    await expect(carousel.locator("[data-slide='project-hermes']")).toHaveAttribute("inert", "");
    expect(await stops()).toEqual([...controls, "Play automatic rotation"]);
    await context.close();
  });

  test("leaving the lobby clears the rotation timer", async ({ browser }) => {
    const { context, page } = await open(browser, "desktop", "default");
    await page.clock.resume();
    expect(await timers(page)).toHaveLength(1);
    await page.getByRole("banner").getByRole("link", { name: "Projects" }).click();
    await page.waitForURL("**/projects");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Select a project");
    await expect.poll(() => timers(page)).toEqual([]);
    await context.close();
  });
});

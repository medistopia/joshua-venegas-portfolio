import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { forbiddenMotion, freezeTimers, openPage, settle, tabTo } from "./helpers";

const ambientDir = "docs/verification/ambient-hermes";
mkdirSync(ambientDir, { recursive: true });

const CYCLE_MS = 24000;

/** The ambient layer: whether it renders, its opacity, and its animations. */
function light(page: Page) {
  return page.evaluate(() => {
    const el = document.querySelector(".ambient-light")!;
    return {
      rendered: el.checkVisibility(),
      opacity: Number(getComputedStyle(el).opacity),
      animations: el.getAnimations().map((animation) => {
        const timing = animation.effect!.getComputedTiming();
        const properties = (animation.effect as KeyframeEffect)
          .getKeyframes()
          .flatMap((frame) => Object.keys(frame).filter((key) => !["offset", "computedOffset", "easing", "composite"].includes(key)));
        return {
          name: (animation as CSSAnimation).animationName,
          playState: animation.playState,
          currentTime: Number(animation.currentTime),
          duration: Number(timing.duration),
          iterations: timing.iterations,
          properties: [...new Set(properties)],
        };
      }),
    };
  });
}

const control = (page: Page) => page.getByRole("banner").getByRole("button", { name: /background motion$/ });
const carousel = (page: Page) => page.locator("[aria-roledescription='carousel']");

function setHidden(page: Page, hidden: boolean) {
  return page.evaluate((hidden) => {
    if (hidden) {
      Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
    } else {
      delete (document as { hidden?: boolean }).hidden;
      delete (document as { visibilityState?: string }).visibilityState;
    }
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}

/** Boxes of the text, navigation, cards and focusable controls that must stay still while the light drifts. */
function stationary(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("header a, header button, main h1, main a, main button, aside button")).map((el) => {
      const r = el.getBoundingClientRect();
      return [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 10) / 10).join(",");
    }),
  );
}

async function advances(page: Page) {
  const before = (await light(page)).animations[0].currentTime;
  await page.waitForTimeout(400);
  return (await light(page)).animations[0].currentTime - before;
}

test.describe("ambient light", () => {
  test("runs an opacity-only loop while text, cards and controls stay still", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    await settle(page);
    await expect(control(page)).toHaveAccessibleName("Pause background motion");
    await expect(control(page)).toHaveAttribute("data-ambient", "playing");

    const state = await light(page);
    expect(state.rendered).toBe(true);
    expect(state.animations).toHaveLength(1);
    expect(state.animations[0]).toMatchObject({ name: "ambient-light", playState: "running", duration: CYCLE_MS, iterations: Infinity, properties: ["opacity"] });
    expect(await advances(page)).toBeGreaterThan(200);

    const rest = await stationary(page);
    await page.waitForTimeout(1200);
    expect(await stationary(page)).toEqual(rest);
    await context.close();
  });

  test("Pause and Play work from the keyboard and leave the carousel alone", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default", "/", { clock: true });
    await settle(page);
    await freezeTimers(page);
    await expect(carousel(page)).toHaveAttribute("data-rotating", "true");

    await tabTo(page, "header [data-ambient]");
    await page.keyboard.press("Enter");
    await expect(control(page)).toHaveAccessibleName("Play background motion");
    await expect(control(page)).toHaveAttribute("data-ambient", "paused");
    expect((await light(page)).animations[0].playState).toBe("paused");
    expect(await advances(page)).toBe(0);
    await expect(carousel(page)).toHaveAttribute("data-rotating", "true");

    await page.keyboard.press("Space");
    await expect(control(page)).toHaveAccessibleName("Pause background motion");
    expect((await light(page)).animations[0].playState).toBe("running");
    expect(await advances(page)).toBeGreaterThan(200);

    // The carousel's own Pause leaves the light running, and the light's state never touches it.
    await carousel(page).getByRole("button", { name: "Pause automatic rotation" }).click();
    await page.mouse.move(5, 895);
    await expect(carousel(page)).toHaveAttribute("data-rotating", "false");
    await expect(control(page)).toHaveAttribute("data-ambient", "playing");
    expect((await light(page)).animations[0].playState).toBe("running");
    await control(page).click();
    await expect(carousel(page).getByRole("button", { name: "Play automatic rotation" })).toBeVisible();
    await context.close();
  });

  test("a hidden page holds the light without changing the visitor's choice", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    await settle(page);

    await setHidden(page, true);
    await expect(control(page)).toHaveAttribute("data-ambient", "paused");
    await expect(control(page)).toHaveAccessibleName("Pause background motion");
    expect((await light(page)).animations[0].playState).toBe("paused");
    expect(await advances(page)).toBe(0);

    await setHidden(page, false);
    await expect(control(page)).toHaveAttribute("data-ambient", "playing");
    expect((await light(page)).animations[0].playState).toBe("running");

    // Paused by the visitor, it stays paused when the page is shown again.
    await control(page).click();
    await setHidden(page, true);
    await setHidden(page, false);
    await expect(control(page)).toHaveAccessibleName("Play background motion");
    expect((await light(page)).animations[0].playState).toBe("paused");
    await context.close();
  });

  test("leaving the lobby stops the light and removes its listener; returning keeps the choice", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default", "/projects");
    await settle(page);
    await page.evaluate(() => {
      const active = new Set<EventListenerOrEventListenerObject>();
      const add = document.addEventListener.bind(document);
      const remove = document.removeEventListener.bind(document);
      document.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) => {
        if (type === "visibilitychange") active.add(listener);
        add(type, listener, options);
      }) as typeof document.addEventListener;
      document.removeEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions) => {
        if (type === "visibilitychange") active.delete(listener);
        remove(type, listener, options);
      }) as typeof document.removeEventListener;
      Object.assign(window, { visibilityListeners: () => active.size });
    });
    const listeners = () => page.evaluate(() => (window as unknown as { visibilityListeners: () => number }).visibilityListeners());
    const nav = page.getByRole("banner").getByRole("navigation", { name: "Primary" });

    expect(await listeners()).toBe(0);
    await nav.getByRole("link", { name: "Home" }).click();
    await expect(control(page)).toBeVisible();
    // The carousel and the ambient control each listen while the lobby is open.
    await expect.poll(listeners).toBe(2);
    expect((await light(page)).animations).toHaveLength(1);
    await control(page).click();

    await nav.getByRole("link", { name: "Projects" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Select a project");
    await expect(page.locator("[data-ambient]")).toHaveCount(0);
    expect((await light(page)).animations).toEqual([]);
    await expect.poll(listeners).toBe(0);

    await nav.getByRole("link", { name: "Home" }).click();
    await expect(control(page)).toHaveAccessibleName("Play background motion");
    expect((await light(page)).animations[0].playState).toBe("paused");
    await context.close();
  });

  test("reduced motion shows the static composition with no control", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "reduced");
    await settle(page);
    await expect(page.locator("[data-ambient]")).toBeHidden();
    const state = await light(page);
    expect(state.animations).toEqual([]);
    expect(state.opacity).toBe(0);
    expect(await forbiddenMotion(page)).toEqual([]);
    await page.screenshot({ path: `${ambientDir}/lobby-desktop-reduced.jpg`, quality: 85 });
    await context.close();
  });

  for (const viewport of ["tablet", "mobile"] as const) {
    test(`below 1024px the light and its control are absent, ${viewport}`, async ({ browser }) => {
      const { context, page } = await openPage(browser, viewport, "default");
      await settle(page);
      await expect(page.locator("[data-ambient]")).toBeHidden();
      const state = await light(page);
      expect(state.rendered).toBe(false);
      expect(state.animations).toEqual([]);
      await context.close();
    });
  }

  test("without JavaScript the light stays at its static state", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default", "/", { javaScriptEnabled: false });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("[data-ambient]")).toHaveCount(0);
    const state = await light(page);
    expect(state.animations).toEqual([]);
    expect(state.opacity).toBe(0);
    await context.close();
  });

  for (const viewport of ["desktop", "laptop", "compact"] as const) {
    test(`captures at rest and at the brightest state, ${viewport}`, async ({ browser }) => {
      const { context, page } = await openPage(browser, viewport, "default", "/", { clock: true });
      await settle(page);
      await freezeTimers(page);
      for (const [name, progress] of [["rest", 0], ["peak", 0.5]] as const) {
        await page.locator(".ambient-light").evaluate((el, at) => {
          for (const animation of el.getAnimations()) {
            animation.pause();
            animation.currentTime = at;
          }
        }, CYCLE_MS * progress);
        expect((await light(page)).opacity).toBeCloseTo(progress === 0 ? 0 : 1, 2);
        await page.screenshot({ path: `${ambientDir}/lobby-${viewport}-${name}.jpg`, quality: 85 });
      }
      await context.close();
    });
  }

  test("record the ambient light, its control and the Hermes overview: default motion", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default", "/", {
      recordVideo: { dir: `${ambientDir}/recordings`, size: { width: 1440, height: 900 } },
    });
    const video = page.video()!;
    await settle(page);
    // Real time: the first third of a cycle, as a visitor sees it.
    await page.waitForTimeout(8000);
    await control(page).click();
    await page.waitForTimeout(800);
    await control(page).click();
    await page.waitForTimeout(1200);
    await page.locator("main [data-pennant='project-hermes']").click();
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await settle(page);
    await page.waitForTimeout(1200);
    await page.getByRole("link", { name: /Recipient recheck/ }).click();
    await page.waitForTimeout(1500);
    await page.getByRole("heading", { name: "Reply workflow" }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await context.close();
    await video.saveAs(`${ambientDir}/ambient-hermes-default.webm`);
    await video.delete();
  });
});

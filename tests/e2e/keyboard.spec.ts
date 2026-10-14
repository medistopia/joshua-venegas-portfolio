import { expect, test, type Page } from "@playwright/test";
import { openPage, settle, tabTo } from "./helpers";

type FocusInfo = {
  stop: string;
  outline: string;
  unclipped: boolean;
};

/** Describes the focused element, its ring, and whether anything could clip that ring. */
function describeFocus(page: Page) {
  return page.evaluate((): FocusInfo | null => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const style = getComputedStyle(el);
    const reach = parseFloat(style.outlineOffset) + parseFloat(style.outlineWidth);
    const rect = el.getBoundingClientRect();
    let unclipped = style.clipPath === "none";
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.clipPath !== "none") unclipped = false;
      if (s.overflowX !== "visible" || s.overflowY !== "visible") {
        const box = a.getBoundingClientRect();
        if (
          rect.left - reach < box.left ||
          rect.top - reach < box.top ||
          rect.right + reach > box.right ||
          rect.bottom + reach > box.bottom
        ) {
          unclipped = false;
        }
      }
    }
    const visibleText = el.cloneNode(true) as HTMLElement;
    visibleText.querySelectorAll("[aria-hidden='true']").forEach((node) => node.remove());
    const name = (el.getAttribute("aria-label") ?? visibleText.textContent ?? "").trim().replace(/\s+/g, " ");
    return {
      stop: el.getAttribute("href") ?? `button ${name}`,
      outline: `${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor}`,
      unclipped,
    };
  });
}

const ring = "solid 2px rgb(61, 214, 196)";

test.describe("desktop keyboard", () => {
  test("skip link appears first and moves focus to main", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    await settle(page);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
    await context.close();
  });

  test("lobby tab order follows the documented sequence with visible, unclipped rings", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    await settle(page);

    const stops: FocusInfo[] = [];
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const info = await describeFocus(page);
      if (info) stops.push(info);
    }

    expect(stops.map((s) => s.stop)).toEqual([
      "#main",
      "/",
      "/",
      "/projects",
      "/experience",
      "/about",
      "/contact",
      "/projects/project-hermes",
      "button Previous item",
      "button Show Foxtrot",
      "button Show Research",
      "button Next item",
      "/about",
      "/contact",
      "/projects/project-hermes",
      "/projects/recolm",
      "/projects/valorant-ml",
      "/projects",
      "/projects/project-hermes",
      "/experience",
      "/about",
      "button Brandon Hall",
      "button Dr. Lai Wei",
      "button Dr. Yong Wei",
      "button Prof. Mohammad Mohebi",
    ]);
    for (const stop of stops.slice(1)) {
      expect(stop.outline, stop.stop).toBe(ring);
      expect(stop.unclipped, `${stop.stop} ring is clipped`).toBe(true);
    }
    await context.close();
  });

  test("carousel controls change the slide and keep inactive slides out of the tab order", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    await settle(page);
    const carousel = page.locator("[aria-roledescription='carousel']");
    await expect(carousel.getByRole("button", { name: "Show Foxtrot" })).toHaveAttribute("aria-current", "true");
    await tabTo(page, "button[aria-label='Next item']");
    await page.keyboard.press("Enter");
    await expect(carousel.getByRole("button", { name: "Show Research" })).toHaveAttribute("aria-current", "true");
    await expect(carousel.getByText("Research with Dr. Lai Wei and Dr. Yong Wei.")).toBeVisible();
    // The Foxtrot slide's link is inert while hidden.
    await expect(carousel.locator("[inert] a[href='/projects/project-hermes']")).toHaveCount(1);
    await context.close();
  });

  test("a collaborator opens with Enter, shows the relationship, and closes with Escape", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    await settle(page);
    const rail = page.getByRole("complementary", { name: "Collaborators" });
    const button = rail.getByRole("button", { name: "Brandon Hall" });
    const popover = page.getByRole("dialog", { name: "Brandon Hall" });

    await tabTo(page, "aside li > button[popovertarget='rail-brandon-hall']");
    await page.keyboard.press("Enter");
    await expect(popover).toBeVisible();
    await expect(popover).toContainText("Special Projects Group");
    await expect(popover).toBeInViewport({ ratio: 1 });
    await expect(popover).not.toContainText(/online|offline|away/i);

    await page.keyboard.press("Escape");
    await expect(popover).toBeHidden();
    await expect(button).toBeFocused();
    await context.close();
  });

  test("Enter on a pennant opens its case study", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    await settle(page);
    await tabTo(page, "main ol a[href='/projects/project-hermes']");
    await page.keyboard.press("Enter");
    await page.waitForURL("**/projects/project-hermes");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Project Hermes");
    await context.close();
  });

  test("every nav tab replaces the stage, marks itself current, and Back returns", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    const nav = page.getByRole("banner").getByRole("navigation", { name: "Primary" });
    const headings: [string, string, string][] = [
      ["/projects", "Projects", "Select a project"],
      ["/experience", "Experience", "Experience"],
      ["/about", "About", "Joshua Venegas"],
      ["/contact", "Contact", "Get in touch"],
      ["/", "Home", "Joshua Venegas"],
    ];
    for (const [href, name, heading] of headings) {
      await nav.getByRole("link", { name }).click();
      await page.waitForURL((url) => url.pathname === href);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "page");
      await expect(nav.locator("[aria-current='page']")).toHaveCount(1);
      // The shell stays in place: the rail is present in every view.
      await expect(page.getByRole("complementary", { name: "Collaborators" })).toBeVisible();
    }

    for (const [href, name] of [...headings].reverse().slice(1)) {
      await page.goBack();
      await page.waitForURL((url) => url.pathname === href);
      await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "page");
    }

    for (const href of ["/", "/projects", "/experience", "/about", "/contact"]) {
      const response = await page.goto(href);
      expect(response?.status(), href).toBe(200);
    }
    await context.close();
  });

  test("the case study scrolls inside its reading panel while navigation stays visible", async ({ browser }) => {
    const { context, page } = await openPage(browser, "laptop", "default", "/projects/project-hermes");
    await settle(page);
    const reader = page.locator("article[aria-labelledby='project-title']");
    const overflow = await reader.evaluate((el) => el.scrollHeight - el.clientHeight);
    expect(overflow, "reading panel has more content than fits").toBeGreaterThan(0);

    await reader.focus();
    await page.keyboard.press("End");
    await expect.poll(() => reader.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    await expect(page.getByText("Full case study in progress")).toBeInViewport();
    await expect(page.getByRole("banner")).toBeInViewport({ ratio: 1 });
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(720);
    await context.close();
  });
});

test.describe("mobile menu", () => {
  test("opens with Enter, keeps focus inside, closes with Escape, and restores focus", async ({ browser }) => {
    const { context, page } = await openPage(browser, "mobile", "default");
    await settle(page);
    const menuButton = page.getByRole("button", { name: "Menu" });
    const dialog = page.getByRole("dialog", { name: "Site menu" });

    await tabTo(page, "button[aria-controls='site-menu']");
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    for (let i = 0; i < 10; i++) {
      const inside = await page.evaluate(() => Boolean(document.activeElement?.closest("dialog[open]")));
      expect(inside, `focus left the dialog after ${i} Tab presses`).toBe(true);
      await page.keyboard.press("Tab");
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await context.close();
  });

  test("opens with Space and navigates from a menu link", async ({ browser }) => {
    const { context, page } = await openPage(browser, "mobile", "default");
    await settle(page);
    await tabTo(page, "button[aria-controls='site-menu']");
    await page.keyboard.press("Space");
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await tabTo(page, "dialog a[href='/experience']");
    await page.keyboard.press("Enter");
    await page.waitForURL("**/experience");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Experience");
    await context.close();
  });

  test("a collaborator in the strip opens a centered popover", async ({ browser }) => {
    const { context, page } = await openPage(browser, "mobile", "default");
    await settle(page);
    await tabTo(page, "li > button[popovertarget='strip-lai-wei']", 60);
    await page.keyboard.press("Enter");
    const popover = page.getByRole("dialog", { name: "Dr. Lai Wei" });
    await expect(popover).toBeVisible();
    await expect(popover).toBeInViewport({ ratio: 1 });
    await expect(popover).toContainText("Dr. Yong Wei");
    await popover.getByRole("button", { name: "Close" }).click();
    await expect(popover).toBeHidden();
    await context.close();
  });
});

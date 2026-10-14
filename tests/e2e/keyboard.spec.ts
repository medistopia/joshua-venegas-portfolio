import { expect, test, type Page } from "@playwright/test";
import { openPage, settle, tabTo } from "./helpers";

type FocusInfo = {
  href: string | null;
  label: string;
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
    return {
      href: el.getAttribute("href"),
      label: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40),
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

  test("tab order follows the documented sequence with visible, unclipped rings", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    await settle(page);

    const stops: FocusInfo[] = [];
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press("Tab");
      const info = await describeFocus(page);
      if (info) stops.push(info);
    }

    expect(stops.map((s) => s.href)).toEqual([
      "#main",
      "/",
      "/",
      "/projects",
      "/experience",
      "/about",
      "/contact",
      "/contact",
      "/about",
      "/projects/project-hermes",
      "/projects/recolm",
      "/projects/valorant-ml",
      "/projects",
      "/experience",
      "/about",
      "/contact",
    ]);
    for (const stop of stops.slice(1)) {
      expect(stop.outline, stop.label).toBe(ring);
      expect(stop.unclipped, `${stop.label} ring is clipped`).toBe(true);
    }
    await context.close();
  });

  test("Enter on a project card opens its page", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    await settle(page);
    await tabTo(page, "a[href='/projects/project-hermes']");
    await page.keyboard.press("Enter");
    await page.waitForURL("**/projects/project-hermes");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Project Hermes");
    await context.close();
  });

  test("every nav tab resolves and marks the active page", async ({ browser }) => {
    const { context, page } = await openPage(browser, "desktop", "default");
    const nav = page.getByRole("banner").getByRole("navigation", { name: "Primary" });
    for (const [href, name] of [
      ["/", "Home"],
      ["/projects", "Projects"],
      ["/experience", "Experience"],
      ["/about", "About"],
      ["/contact", "Contact"],
    ]) {
      const response = await page.goto(href);
      expect(response?.status(), href).toBe(200);
      await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "page");
      await expect(nav.locator("[aria-current='page']")).toHaveCount(1);
    }
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
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Current roles");
    await context.close();
  });
});

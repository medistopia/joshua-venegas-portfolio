import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { openPage, settle } from "./helpers";

const output = "docs/verification/ambient-hermes";
mkdirSync(output, { recursive: true });

const decisions = [
  { link: "Session boundaries", target: "case-sessions", heading: "Decision 1: make session boundaries explicit" },
  { link: "OAuth refusal", target: "case-oauth", heading: "Decision 2: finish the refusal workflow" },
  { link: "Recipient recheck", target: "case-recipients", heading: "Decision 3: show the destination, then recheck it" },
];

const steps = ["Protected sign-in", "Gmail thread", "Contact and deal context", "Reply composer", "Server recipient recheck", "Gmail send"];
const systems = ["Hermes", "Gmail", "Supabase", "Hermes", "Hermes", "Gmail"];

function boxes(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, right: r.right, bottom: r.bottom, center: r.left + r.width / 2 };
    }),
  );
}

for (const viewport of ["desktop", "mobile"] as const) {
  test.describe(`Hermes overview and workflow, ${viewport}`, () => {
    test("the overview comes first and its decision links reach their sections", async ({ browser }) => {
      const { context, page } = await openPage(browser, viewport, "reduced", "/projects/project-hermes");
      await settle(page);
      const reader = page.getByRole("article");
      const overview = reader.getByRole("region", { name: "Overview" });

      await expect(reader.getByRole("heading", { level: 2 }).first()).toHaveText("Overview");
      await expect(overview.locator("dt")).toHaveText(["Problem", "My role", "Delivered", "Status"]);
      await expect(overview).toContainText("Brandon Hall");
      await expect(overview).toContainText("Phase 1 production release: October 8, 2026");
      if (viewport === "desktop") await expect(reader.getByRole("heading", { name: "Overview" })).toBeInViewport();
      await overview.screenshot({ path: `${output}/hermes-overview-${viewport}.jpg`, quality: 85 });

      const list = overview.getByRole("list", { name: "Key engineering decisions" });
      await expect(list.getByRole("link")).toHaveCount(3);
      for (const [i, decision] of decisions.entries()) {
        const link = list.getByRole("link", { name: new RegExp(decision.link) });
        await expect(link).toHaveAttribute("href", `#${decision.target}`);
        const heading = page.locator(`#${decision.target}`);
        await expect(heading).toHaveText(decision.heading);
        await expect(heading).not.toBeInViewport();

        // Alternate pointer and keyboard activation.
        if (i % 2 === 0) await link.click();
        else {
          await link.focus();
          await page.keyboard.press("Enter");
        }
        await expect(page).toHaveURL(new RegExp(`#${decision.target}$`));
        await expect(heading).toBeInViewport();
        if (viewport === "desktop") {
          // The reader scrolls; the shell's navigation stays in place.
          await expect(page.getByRole("banner")).toBeInViewport({ ratio: 1 });
          expect(await page.evaluate(() => document.documentElement.scrollTop)).toBe(0);
        }
        await overview.scrollIntoViewIfNeeded();
      }
      await context.close();
    });

    test("the workflow diagram names each step, its system and the review path, with a text description", async ({ browser }) => {
      const { context, page } = await openPage(browser, viewport, "reduced", "/projects/project-hermes");
      await settle(page);
      const figure = page.getByRole("figure", { name: "Reply workflow" });
      await figure.scrollIntoViewIfNeeded();

      const items = figure.getByRole("listitem");
      await expect(items).toHaveCount(6);
      for (const [i, title] of steps.entries()) {
        await expect(items.nth(i)).toContainText(`Step ${i + 1}`);
        await expect(items.nth(i)).toContainText(title);
        await expect(items.nth(i)).toContainText(systems[i]);
      }
      // The review path is part of step 5 for assistive technology at every size.
      const review = items.nth(4).locator("[data-review-path]");
      await expect(review).toContainText("Changed or missing recipient");
      await expect(review).toContainText("Nothing is sent. The current conversation returns to the composer for review. Back to step 4.");
      await expect(figure.locator("dt")).toHaveText(["Hermes", "Gmail", "Supabase"]);
      await expect(figure.locator("dd").nth(1)).toContainText("Mail storage and delivery");
      await expect(figure.locator("dd").nth(2)).toContainText("contacts, deals and conversation links");
      await expect(figure.locator("figcaption")).toContainText("If it changed or is missing, nothing is sent");
      await expect(figure.locator("figcaption")).toContainText("Gmail stores and delivers the mail; Supabase holds only Hermes's records.");

      const cards = await boxes(page, "figure li[data-step]");
      const loop = page.locator("figure > [aria-hidden='true']");
      if (viewport === "desktop") {
        // Three columns: 1-3 share a row, 4-6 the next, and the loop hangs from step 5 back to step 4.
        for (const row of [[0, 1, 2], [3, 4, 5]]) {
          for (const i of row) expect(Math.abs(cards[i].y - cards[row[0]].y)).toBeLessThanOrEqual(1);
        }
        expect(cards[3].y).toBeGreaterThan(cards[0].bottom);
        expect(cards[1].x).toBeGreaterThan(cards[0].right);
        await expect(loop).toBeVisible();
        await expect(items.nth(4).locator("[data-review-path]")).toHaveCSS("clip-path", "inset(50%)");
        const [arms] = await boxes(page, "figure > [aria-hidden='true']");
        expect(Math.abs(arms.x - cards[3].center)).toBeLessThanOrEqual(2);
        expect(Math.abs(arms.right - cards[4].center)).toBeLessThanOrEqual(2);
        expect(Math.abs(arms.y - cards[4].bottom)).toBeLessThanOrEqual(1);
      } else {
        // One column in step order, with the review path shown inside step 5.
        for (let i = 1; i < cards.length; i++) {
          expect(Math.abs(cards[i].x - cards[0].x)).toBeLessThanOrEqual(1);
          expect(cards[i].y).toBeGreaterThan(cards[i - 1].bottom);
        }
        await expect(loop).toBeHidden();
        await expect(items.nth(4).locator("[data-review-path]")).toBeVisible();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
      await figure.screenshot({ path: `${output}/hermes-workflow-${viewport}.jpg`, quality: 85 });
      await context.close();
    });
  });
}

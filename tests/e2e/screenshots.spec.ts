import { mkdirSync } from "node:fs";
import { test } from "@playwright/test";
import {
  openPage,
  settle,
  tabTo,
  verificationDir,
  views,
  viewports,
  type Motion,
  type ViewportName,
} from "./helpers";

mkdirSync(verificationDir, { recursive: true });

const shot = (name: string) => ({ path: `${verificationDir}/${name}.jpg`, type: "jpeg" as const, quality: 85 });

for (const viewport of Object.keys(viewports) as ViewportName[]) {
  for (const motion of ["default", "reduced"] as Motion[]) {
    test(`home ${viewport} ${motion}`, async ({ browser }) => {
      const { context, page } = await openPage(browser, viewport, motion);
      await settle(page);
      await page.screenshot(shot(`home-${viewport}-${motion}`));
      if (viewports[viewport].width < 1024) {
        await page.screenshot({ ...shot(`home-${viewport}-${motion}-full`), fullPage: true });
      }

      if (viewport === "desktop") {
        await page.locator("main ol a[href='/projects/project-hermes']").hover();
        await page.waitForTimeout(400);
        await page.screenshot(shot(`home-desktop-${motion}-card-hover`));

        await page.mouse.move(5, 895);
        await tabTo(page, "main ol a[href='/projects/recolm']");
        await page.waitForTimeout(400);
        await page.screenshot(shot(`home-desktop-${motion}-card-focus`));

        await page.getByRole("button", { name: "Next item" }).click();
        await page.waitForTimeout(400);
        await page.screenshot(shot(`home-desktop-${motion}-carousel-research`));

        await page.locator("aside li > button[popovertarget='rail-brandon-hall']").click();
        await page.waitForTimeout(200);
        await page.screenshot(shot(`home-desktop-${motion}-collaborator`));
      }

      if (viewport === "mobile") {
        await page.locator("li > button[popovertarget='strip-mohammad-mohebi']").click();
        await page.waitForTimeout(200);
        await page.screenshot(shot(`home-mobile-${motion}-collaborator`));
        await page.keyboard.press("Escape");

        await page.evaluate(() => scrollTo(0, 0));
        await page.getByRole("button", { name: "Menu" }).click();
        await page.waitForTimeout(200);
        await page.screenshot(shot(`home-mobile-${motion}-menu`));
      }

      await context.close();
    });
  }
}

for (const [name, path] of Object.entries(views).filter(([name]) => name !== "home")) {
  for (const viewport of ["desktop", "laptop", "tablet", "mobile"] as ViewportName[]) {
    test(`${name} ${viewport}`, async ({ browser }) => {
      const { context, page } = await openPage(browser, viewport, "reduced", path);
      await settle(page);
      const full = viewports[viewport].width < 1024;
      await page.screenshot({ ...shot(`${name}-${viewport}`), fullPage: full });
      await context.close();
    });
  }
}

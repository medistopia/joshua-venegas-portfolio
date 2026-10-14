import { mkdirSync } from "node:fs";
import { test } from "@playwright/test";
import { openPage, settle, tabTo, verificationDir, viewports, type Motion, type ViewportName } from "./helpers";

mkdirSync(verificationDir, { recursive: true });

const shot = (name: string) => ({ path: `${verificationDir}/${name}.jpg`, type: "jpeg" as const, quality: 85 });

for (const viewport of Object.keys(viewports) as ViewportName[]) {
  for (const motion of ["default", "reduced"] as Motion[]) {
    test(`home ${viewport} ${motion}`, async ({ browser }) => {
      const { context, page } = await openPage(browser, viewport, motion);
      await settle(page);
      await page.screenshot(shot(`home-${viewport}-${motion}`));
      await page.screenshot({ ...shot(`home-${viewport}-${motion}-full`), fullPage: true });

      if (viewport === "desktop") {
        const hermes = page.locator("a[href='/projects/project-hermes']").first();
        await hermes.hover();
        await page.waitForTimeout(400);
        await page.screenshot(shot(`home-desktop-${motion}-card-hover`));

        await page.mouse.move(5, 895);
        await tabTo(page, "a[href='/projects/project-hermes']");
        await page.waitForTimeout(400);
        await page.screenshot(shot(`home-desktop-${motion}-card-focus`));
      }

      if (viewport === "mobile") {
        await page.getByRole("button", { name: "Menu" }).click();
        await page.waitForTimeout(200);
        await page.screenshot(shot(`home-mobile-${motion}-menu`));
      }

      await context.close();
    });
  }
}

import { mkdirSync, writeFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { openPage, settle, verificationDir, views, viewports, type ViewName, type ViewportName } from "./helpers";

type Target = {
  text: string;
  color: [number, number, number, number];
  required: number;
  fontSize: number;
  box: { x0: number; y0: number; x1: number; y1: number };
};

type Result = {
  state: string;
  kind: "text" | "control";
  text: string;
  color: string;
  fontSize: number;
  required: number;
  minRatio: number;
  worstBackground: string;
  pixels: number;
};

mkdirSync(verificationDir, { recursive: true });

const cases: [ViewName, ViewportName][] = [
  ...(Object.keys(viewports) as ViewportName[]).map((viewport): [ViewName, ViewportName] => ["home", viewport]),
  ...(Object.keys(views) as ViewName[])
    .filter((view) => view !== "home")
    .flatMap((view) => (["desktop", "mobile"] as ViewportName[]).map((viewport): [ViewName, ViewportName] => [view, viewport])),
];

/** Carousel graphics that identify a control: the arrow and play icons and the slide indicators. */
const controlGraphics = "[aria-roledescription='carousel'] button svg, [aria-roledescription='carousel'] [data-indicator]";

/** One box per rendered line of every visible text node in the first viewport. */
function textTargets(page: Page): Promise<Target[]> {
  return page.evaluate(() => {
    const canvas = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
    const toRgba = (css: string, opacity: number): [number, number, number, number] => {
      canvas.clearRect(0, 0, 1, 1);
      canvas.fillStyle = css;
      canvas.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
      return [r, g, b, (a / 255) * opacity];
    };

    const out: Target[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const text = node.textContent?.trim();
      const el = node.parentElement;
      if (!text || !el) continue;
      const style = getComputedStyle(el);
      if (style.visibility !== "visible") continue;

      let opacity = 1;
      let hidden = false;
      for (let a: Element | null = el; a; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (s.display === "none" || s.clipPath === "inset(50%)") hidden = true;
        opacity *= parseFloat(s.opacity);
      }
      if (hidden || opacity === 0) continue;

      // Lines scrolled out of a reading panel or the stage are not on screen.
      let clip = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
      for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (s.overflowX === "visible" && s.overflowY === "visible") continue;
        const c = a.getBoundingClientRect();
        clip = {
          left: Math.max(clip.left, c.left),
          top: Math.max(clip.top, c.top),
          right: Math.min(clip.right, c.right),
          bottom: Math.min(clip.bottom, c.bottom),
        };
      }

      const fontSize = parseFloat(style.fontSize);
      const large = fontSize >= 24 || (fontSize >= 18.66 && Number(style.fontWeight) >= 700);
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of Array.from(range.getClientRects())) {
        const box = {
          x0: Math.max(clip.left, r.left),
          y0: Math.max(clip.top, r.top),
          x1: Math.min(clip.right, r.right),
          y1: Math.min(clip.bottom, r.bottom),
        };
        if (box.x1 - box.x0 < 2 || box.y1 - box.y0 < 2) continue;
        out.push({
          text: text.replace(/\s+/g, " ").slice(0, 60),
          color: toRgba(style.color, opacity),
          required: large ? 3 : 4.5,
          fontSize,
          box,
        });
      }
    }
    return out;
  });
}

/** Control graphics in the active state, held to the 3:1 non-text minimum. */
function controlTargets(page: Page): Promise<Target[]> {
  return page.evaluate((selector) => {
    const canvas = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
    return Array.from(document.querySelectorAll(selector)).map((el) => {
      canvas.clearRect(0, 0, 1, 1);
      canvas.fillStyle = getComputedStyle(el).color;
      canvas.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
      const rect = el.getBoundingClientRect();
      const button = el.closest("button")!;
      return {
        text: `${button.getAttribute("aria-label")}${button.getAttribute("aria-current") ? " (current)" : ""}`,
        color: [r, g, b, a / 255] as [number, number, number, number],
        required: 3,
        fontSize: 0,
        box: { x0: rect.left, y0: rect.top, x1: rect.right, y1: rect.bottom },
      };
    });
  }, controlGraphics);
}

/**
 * Minimum contrast between each target's color and every background pixel inside its box,
 * with the targets themselves hidden from the capture.
 */
async function measure(page: Page, targets: Target[], hideCss: string, state: string, kind: Result["kind"]) {
  const hide = await page.addStyleTag({ content: hideCss });
  const background = (await page.screenshot({ type: "png" })).toString("base64");
  await hide.evaluate((node) => (node as Element).remove());

  return page.evaluate(
    async ({ targets, background, state, kind }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${background}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      const scale = img.naturalWidth / innerWidth;

      const channel = (c: number) => {
        const s = c / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      const luminance = (r: number, g: number, b: number) =>
        0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      const hex = (r: number, g: number, b: number) =>
        `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

      return targets.map((target) => {
        const x = Math.floor(target.box.x0 * scale);
        const y = Math.floor(target.box.y0 * scale);
        const w = Math.max(1, Math.floor((target.box.x1 - target.box.x0) * scale));
        const h = Math.max(1, Math.floor((target.box.y1 - target.box.y0) * scale));
        const data = ctx.getImageData(x, y, w, h).data;
        const [tr, tg, tb, ta] = target.color;

        let minRatio = Infinity;
        let worst = "";
        for (let i = 0; i < data.length; i += 4) {
          const [br, bg, bb] = [data[i], data[i + 1], data[i + 2]];
          const fg = luminance(ta * tr + (1 - ta) * br, ta * tg + (1 - ta) * bg, ta * tb + (1 - ta) * bb);
          const back = luminance(br, bg, bb);
          const ratio = (Math.max(fg, back) + 0.05) / (Math.min(fg, back) + 0.05);
          if (ratio < minRatio) {
            minRatio = ratio;
            worst = hex(br, bg, bb);
          }
        }

        return {
          state,
          kind,
          text: target.text,
          color: `${hex(tr, tg, tb)}${ta < 1 ? ` at ${Math.round(ta * 100)}%` : ""}`,
          fontSize: target.fontSize,
          required: target.required,
          minRatio: Math.round(minRatio * 100) / 100,
          worstBackground: worst,
          pixels: data.length / 4,
        };
      });
    },
    { targets, background, state, kind },
  );
}

const hideText =
  "* { -webkit-text-fill-color: transparent !important; text-shadow: none !important; text-decoration-color: transparent !important; caret-color: transparent !important; }";
const hideControls = `${controlGraphics} { visibility: hidden !important; }`;

for (const [view, viewport] of cases) {
  test(`text contrast at actual positions, ${view} ${viewport}`, async ({ browser }) => {
    const { context, page } = await openPage(browser, viewport, "reduced", views[view]);
    await settle(page);

    // On the lobby, every carousel slide is measured in turn, with its controls.
    const states = view === "home" ? ["project-hermes", "wei-research"] : ["page"];
    const results: Result[] = [];
    for (const state of states) {
      if (state === "wei-research") {
        // A synthetic click selects the slide without leaving hover or focus styles behind.
        await page.locator("[aria-roledescription='carousel'] button[aria-label='Show Research']").dispatchEvent("click");
        await expect(page.locator(`[data-slide='${state}']`)).not.toHaveAttribute("inert");
        await settle(page);
      }
      const text = await textTargets(page);
      expect(text.length).toBeGreaterThan(view === "home" ? 10 : 5);
      results.push(...(await measure(page, text, hideText, state, "text")));

      if (view === "home") {
        await expect(page.locator(`[data-slide='${state}'] h3`)).toBeVisible();
        const controls = await controlTargets(page);
        expect(controls).toHaveLength(5);
        results.push(...(await measure(page, controls, hideControls, state, "control")));
      }
    }

    const failures = results.filter((r) => r.minRatio < r.required);
    writeFileSync(
      `${verificationDir}/contrast-${view}-${viewport}.json`,
      `${JSON.stringify(
        {
          path: views[view],
          viewport: viewports[viewport],
          browser: `Chromium ${browser.version()}`,
          states,
          method: [
            "Minimum WCAG contrast between each rendered line's text color and every background pixel inside that line's box, captured with glyphs hidden (4.5:1, or 3:1 for large text).",
            view === "home" &&
              "Each carousel slide is measured in turn, and the carousel's control icons and indicators are held to 3:1 against the pixels behind them, captured with those graphics hidden.",
            "First viewport, reduced motion.",
          ]
            .filter(Boolean)
            .join(" "),
          lines: results.length,
          failures: failures.length,
          lowest: [...results].sort((a, b) => a.minRatio / a.required - b.minRatio / b.required).slice(0, 5),
          results,
        },
        null,
        2,
      )}\n`,
    );

    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
    await context.close();
  });
}

for (const viewport of ["desktop", "mobile"] as const) {
  test(`Hermes reading sections retain contrast, ${viewport}`, async ({ browser }) => {
    const { context, page } = await openPage(browser, viewport, "reduced", views["project-hermes"]);
    await settle(page);
    const results: Result[] = [];
    for (const section of await page.locator("article section").all()) {
      await section.scrollIntoViewIfNeeded();
      results.push(...await measure(page, await textTargets(page), hideText, await section.getAttribute("aria-labelledby") ?? "section", "text"));
    }
    writeFileSync(`${verificationDir}/contrast-hermes-reading-${viewport}.json`, JSON.stringify({ browser: browser.version(), results }, null, 2) + "\n");
    expect(results.filter((r) => r.minRatio < r.required)).toEqual([]);
    await context.close();
  });
}

for (const viewport of ["desktop", "compact", "mobile"] as const) {
  test(`motion text contrast at start and midpoint, ${viewport}`, async ({ browser }) => {
    const results: Result[] = [];
    for (const path of ["/", "/projects"]) {
      const { context, page } = await openPage(browser, viewport, "default", path);
      await settle(page);
      for (const progress of [0, 0.5]) {
        await page.locator(".animate-rise, .motion-projects").evaluateAll((els, progress) => {
          for (const el of els) (el as HTMLElement).style.animationName = "none";
          void document.body.offsetHeight;
          for (const el of els) (el as HTMLElement).style.removeProperty("animation-name");
          void document.body.offsetHeight;
          for (const el of els) for (const animation of el.getAnimations()) {
            animation.pause();
            const timing = animation.effect!.getTiming();
            animation.currentTime = (timing.delay ?? 0) + Number(timing.duration) * progress;
          }
        }, progress);
        results.push(...await measure(page, await textTargets(page), hideText, `${path}:${progress}`, "text"));
      }
      await context.close();
    }
    writeFileSync(`${verificationDir}/contrast-motion-${viewport}.json`, JSON.stringify({ browser: browser.version(), results }, null, 2) + "\n");
    expect(results.filter((r) => r.minRatio < r.required)).toEqual([]);
  });
}

import { expect, test, type Page } from "@playwright/test";
import { settle, views } from "./helpers";

type Mode = "lobby" | "compact" | "tablet" | "mobile";

/** Breakpoints from docs/design.md, Section 9, plus the sizes where clipping was reported. */
const cases: { width: number; height: number; mode: Mode }[] = [
  { width: 1920, height: 1080, mode: "lobby" },
  { width: 1536, height: 864, mode: "lobby" },
  { width: 1440, height: 900, mode: "lobby" },
  { width: 1366, height: 768, mode: "lobby" },
  { width: 1280, height: 1024, mode: "lobby" },
  { width: 1280, height: 720, mode: "lobby" },
  { width: 1279, height: 900, mode: "compact" },
  { width: 1100, height: 900, mode: "compact" },
  { width: 1024, height: 768, mode: "compact" },
  { width: 1024, height: 1366, mode: "compact" },
  { width: 1023, height: 768, mode: "tablet" },
  { width: 820, height: 1180, mode: "tablet" },
  { width: 768, height: 1024, mode: "tablet" },
  { width: 640, height: 960, mode: "tablet" },
  { width: 639, height: 900, mode: "mobile" },
  { width: 390, height: 844, mode: "mobile" },
  { width: 320, height: 640, mode: "mobile" },
];

type Box = { x: number; y: number; w: number; h: number; right: number; bottom: number };

/**
 * Glyph containment: every rendered line of text stays inside its nearest block's box and inside
 * the viewport horizontally. Element boxes alone miss a heading whose ink runs past its column.
 */
function glyphOverflow(page: Page) {
  return page.evaluate(() => {
    const issues: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    const hidden = (el: Element) => {
      for (let a: Element | null = el; a; a = a.parentElement) {
        const s = getComputedStyle(a);
        if (s.display === "none" || s.visibility === "hidden" || s.clipPath === "inset(50%)") return true;
        if (a.matches("[inert], [popover]:not(:popover-open), dialog:not([open])")) return true;
      }
      return false;
    };
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const text = node.textContent?.trim();
      const el = node.parentElement;
      if (!text || !el || hidden(el)) continue;
      const block = el.closest("a, button, li, p, h1, h2, h3, dt, dd, section, aside, nav, div");
      if (!block) continue;
      const box = block.getBoundingClientRect();
      range.selectNodeContents(node);
      for (const r of Array.from(range.getClientRects())) {
        if (r.width === 0) continue;
        if (r.left < box.left - 1 || r.right > box.right + 1) issues.push(`"${text.slice(0, 30)}" runs past its box`);
        if (r.left < -0.5 || r.right > innerWidth + 0.5) issues.push(`"${text.slice(0, 30)}" runs past the viewport`);
      }
    }
    return [...new Set(issues)];
  });
}

function shellMetrics(page: Page) {
  return page.evaluate(() => {
    const main = document.querySelector("main")!;
    return {
      docHeight: document.documentElement.scrollHeight,
      docWidth: document.documentElement.scrollWidth,
      mainOverflow: main.scrollHeight - main.clientHeight,
      railVisible: Boolean(document.querySelector("aside[aria-labelledby='collaborators-rail-heading']")?.checkVisibility()),
    };
  });
}

for (const { width, height, mode } of cases) {
  test(`lobby layout at ${width}x${height} (${mode})`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await settle(page);

    const report = await page.evaluate(() => {
      const box = (el: Element): Box => {
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height, right: r.right, bottom: r.bottom + scrollY };
      };
      /** The class of the first ancestor that clips its overflow and cuts any part of the element. */
      const clippedBy = (el: Element) => {
        const r = el.getBoundingClientRect();
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const s = getComputedStyle(a);
          if (s.overflowX === "visible" && s.overflowY === "visible") continue;
          const c = a.getBoundingClientRect();
          if (r.left < c.left - 0.5 || r.right > c.right + 0.5 || r.top < c.top - 0.5 || r.bottom > c.bottom + 0.5) {
            return a.className.toString().slice(0, 60) || a.tagName;
          }
        }
        return null;
      };
      const named = (selector: string) => {
        const el = document.querySelector(selector);
        return el ? { box: box(el), clippedBy: clippedBy(el) } : null;
      };

      const cards = Array.from(document.querySelectorAll("[data-pennant]")).map((card) => {
        const cardBox = card.getBoundingClientRect();
        // Label and title end above the pennant point (42px) and stay inside the card's sides.
        const textOverflow = Array.from(card.querySelectorAll("[id$='-label'], [id$='-title']"))
          .filter((t) => {
            const r = t.getBoundingClientRect();
            return r.bottom > cardBox.bottom - 42 + 0.5 || r.right > cardBox.right + 0.5 || r.left < cardBox.left - 0.5;
          })
          .map((t) => t.textContent?.trim());
        return { slug: card.getAttribute("data-pennant"), box: box(card), clippedBy: clippedBy(card), textOverflow };
      });

      const tiles = Array.from(document.querySelectorAll("main nav[aria-label='Highlights'] a")).map((tile) => ({
        href: tile.getAttribute("href"),
        box: box(tile),
        clippedBy: clippedBy(tile),
      }));

      const nameRange = document.createRange();
      nameRange.selectNodeContents(document.querySelector("#hero-name")!);
      const nameInkRight = Math.max(...Array.from(nameRange.getClientRects()).map((r) => r.right));

      return {
        viewport: { width: innerWidth, height: innerHeight },
        header: box(document.querySelector("header")!),
        cards,
        tiles,
        nameInkRight,
        heading: named("#hero-name"),
        explore: named("section[aria-labelledby='lineup-heading'] > a[href='/projects']"),
        strip: named("section[aria-labelledby='collaborators-strip-heading']"),
      };
    });
    const shell = await shellMetrics(page);

    const { viewport } = report;
    const bySlug = Object.fromEntries(report.cards.map((c) => [c.slug, c.box]));
    const hermes = bySlug["project-hermes"];
    const recolm = bySlug["recolm"];
    const valorant = bySlug["valorant-ml"];

    expect(shell.docWidth, "horizontal scrolling").toBeLessThanOrEqual(viewport.width);
    expect(await glyphOverflow(page), "text runs past its box").toEqual([]);
    expect(report.cards).toHaveLength(3);
    expect(report.tiles, "three highlight tiles").toHaveLength(3);

    for (const item of [...report.cards, ...report.tiles, report.heading!, report.explore!]) {
      expect(item.box.x, "left edge inside the viewport").toBeGreaterThanOrEqual(0);
      expect(item.box.right, "right edge inside the viewport").toBeLessThanOrEqual(viewport.width + 0.5);
      expect(item.clippedBy, "clipped by an overflow container").toBeNull();
    }
    for (const card of report.cards) {
      expect(card.textOverflow, `${card.slug} text runs into the pennant point or past the sides`).toEqual([]);
    }

    if (mode !== "mobile") {
      // Seated Recolm, Hermes, Valorant ML; flanks are 0.9 of the lead and tuck 16px behind it.
      expect(recolm.x).toBeLessThan(hermes.x);
      expect(hermes.x).toBeLessThan(valorant.x);
      expect(recolm.right - hermes.x, "Recolm tucks behind Hermes").toBeCloseTo(16, 0);
      expect(hermes.right - valorant.x, "Valorant ML tucks behind Hermes").toBeCloseTo(16, 0);
      expect(Math.abs(hermes.h - 2 * hermes.w)).toBeLessThanOrEqual(1.5);
      expect(Math.abs(recolm.h - 0.9 * hermes.h)).toBeLessThanOrEqual(1.5);
      expect(hermes.h).toBeGreaterThanOrEqual(400);
    }

    if (mode === "lobby" || mode === "compact") {
      // The shell is the page: nothing scrolls, nothing is clipped, and the rail is present.
      expect(shell.docHeight, "document taller than the viewport").toBeLessThanOrEqual(viewport.height);
      expect(shell.mainOverflow, "lobby taller than the stage area").toBeLessThanOrEqual(0);
      expect(shell.railVisible, "collaborator rail").toBe(true);
      expect(report.strip?.box.h ?? 0, "collaborator strip hidden").toBe(0);
      expect(report.nameInkRight, "name ink runs behind the first pennant").toBeLessThanOrEqual(recolm.x);
      for (const item of [...report.cards, ...report.tiles, report.heading!, report.explore!]) {
        expect(item.box.y, "below the top bar").toBeGreaterThanOrEqual(report.header.bottom - 0.5);
        expect(item.box.bottom, "inside the first viewport").toBeLessThanOrEqual(viewport.height + 0.5);
      }
    }

    if (mode === "lobby") {
      // Tiles form the right column, as tall as the lead pennant.
      for (const tile of report.tiles) expect(tile.box.x).toBeGreaterThanOrEqual(valorant.right);
      const column = report.tiles.at(-1)!.box.bottom - report.tiles[0].box.y;
      expect(Math.abs(column - hermes.h)).toBeLessThanOrEqual(1.5);
    }

    if (mode === "compact" || mode === "tablet") {
      // Tiles form one row beneath the stage.
      const rowTop = report.tiles[0].box.y;
      for (const tile of report.tiles) expect(Math.abs(tile.box.y - rowTop)).toBeLessThanOrEqual(1);
      expect(rowTop).toBeGreaterThanOrEqual(report.explore!.box.bottom);
    }

    if (mode === "tablet" || mode === "mobile") {
      expect(shell.railVisible, "rail hidden below 1024px").toBe(false);
      expect(report.strip!.box.y, "collaborators follow the tiles").toBeGreaterThanOrEqual(report.tiles.at(-1)!.box.bottom);
    }

    if (mode === "mobile") {
      // One column in featured order, Hermes first, each card full width.
      expect(hermes.y).toBeLessThan(recolm.y);
      expect(recolm.y).toBeLessThan(valorant.y);
      for (const card of report.cards) expect(Math.abs(card.box.x - hermes.x)).toBeLessThanOrEqual(1);
      expect(hermes.y, "the name comes before the lineup").toBeGreaterThan(report.heading!.box.bottom);
    }

    await context.close();
  });
}

const viewSizes = [
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];

for (const [name, path] of Object.entries(views).filter(([name]) => name !== "home")) {
  for (const { width, height } of viewSizes) {
    test(`${name} view at ${width}x${height}`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(path);
      await settle(page);
      const shell = await shellMetrics(page);

      expect(shell.docWidth, "horizontal scrolling").toBeLessThanOrEqual(width);
      expect(await glyphOverflow(page), "text runs past its box").toEqual([]);
      await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
      if (width >= 1024) {
        // Long views scroll inside the shell instead of growing the page or being cut off.
        expect(shell.docHeight, "document taller than the viewport").toBeLessThanOrEqual(height);
        expect(shell.railVisible, "collaborator rail").toBe(true);
      }
      await context.close();
    });
  }
}

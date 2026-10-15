import { expect, test } from "@playwright/test";
import { settle } from "./helpers";

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

for (const { width, height, mode } of cases) {
  test(`homepage layout at ${width}x${height} (${mode})`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await settle(page);

    const report = await page.evaluate(() => {
      const box = (el: Element): Box => {
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height, right: r.right, bottom: r.bottom + scrollY };
      };
      /** True when an ancestor that clips its overflow cuts any part of the element. */
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
      const visible = (el: Element) => getComputedStyle(el).display !== "none" && el.getBoundingClientRect().width > 0;

      const cards = Array.from(document.querySelectorAll("main ol a[href^='/projects/']")).map((card) => {
        const cardBox = card.getBoundingClientRect();
        // Text must end above the pennant point (28px) and stay inside the card's sides.
        const textOverflow = Array.from(card.querySelectorAll("h3, p, span.label"))
          .filter(visible)
          .filter((t) => {
            const r = t.getBoundingClientRect();
            const isBadge = r.top < cardBox.top + 1;
            return !isBadge && (r.bottom > cardBox.bottom - 28 + 0.5 || r.right > cardBox.right + 0.5 || r.left < cardBox.left - 0.5);
          })
          .map((t) => t.textContent?.trim());
        const cue = card.querySelector("[data-card-cue]");
        return {
          href: card.getAttribute("href"),
          box: box(card),
          clippedBy: clippedBy(card),
          textOverflow,
          cue: Boolean(cue && visible(cue)),
        };
      });

      const tiles = Array.from(document.querySelectorAll("main nav[aria-label='Sections'] a"))
        .filter(visible)
        .map((tile) => ({ href: tile.getAttribute("href"), box: box(tile), clippedBy: clippedBy(tile) }));

      const named = (selector: string) => {
        const el = document.querySelector(selector);
        return el && visible(el) ? { box: box(el), clippedBy: clippedBy(el) } : null;
      };

      return {
        viewport: { width: innerWidth, height: innerHeight },
        scrollWidth: document.documentElement.scrollWidth,
        cards,
        tiles,
        heading: named("main h1"),
        actions: named("main section[aria-labelledby='hero-name'] .flex-wrap"),
        explore: named("main section[aria-labelledby='featured-heading'] > a[href='/projects']"),
        lineup: named("main ol"),
        tileNav: named("main nav[aria-label='Sections']"),
      };
    });

    const { viewport } = report;
    const byHref = Object.fromEntries(report.cards.map((c) => [c.href, c.box]));
    const hermes = byHref["/projects/project-hermes"];
    const recolm = byHref["/projects/recolm"];
    const valorant = byHref["/projects/valorant-ml"];

    expect(report.scrollWidth, "horizontal scrolling").toBeLessThanOrEqual(viewport.width);
    expect(report.cards).toHaveLength(3);

    for (const item of [...report.cards, ...report.tiles, report.heading!, report.explore!]) {
      expect(item.box.x, "left edge inside the viewport").toBeGreaterThanOrEqual(0);
      expect(item.box.right, "right edge inside the viewport").toBeLessThanOrEqual(viewport.width + 0.5);
      expect(item.clippedBy, "clipped by an overflow container").toBeNull();
    }
    for (const card of report.cards) {
      expect(card.textOverflow, `${card.href} text runs into the pennant or past the sides`).toEqual([]);
    }
    // The "View project" cue shows wherever the card has room for it.
    if (width === 1440 && height === 900) {
      expect(report.cards.find((c) => c.href === "/projects/project-hermes")?.cue, "lead card cue").toBe(true);
    }
    if (width === 390) expect(report.cards.map((c) => c.cue)).toEqual([true, true, true]);

    if (mode === "lobby" || mode === "compact") {
      expect(report.tiles, "Experience, About, and Contact tiles").toHaveLength(3);
      // Desktop order: Recolm left, Hermes center, Valorant ML right; every card 1:2.
      expect(recolm.right).toBeLessThanOrEqual(hermes.x);
      expect(hermes.right).toBeLessThanOrEqual(valorant.x);
      for (const card of report.cards) expect(Math.abs(card.box.h - 2 * card.box.w)).toBeLessThanOrEqual(1.5);
      expect(Math.abs(recolm.h - 0.88 * hermes.h)).toBeLessThanOrEqual(1.5);
      expect(hermes.h).toBeGreaterThanOrEqual(400);

      // The identity block, lineup, and tiles never overlap.
      const disjoint = (a: Box, b: Box) => a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y;
      expect(disjoint(report.heading!.box, report.lineup!.box), "name overlaps the lineup").toBe(true);
      expect(disjoint(report.lineup!.box, report.tileNav!.box), "tiles overlap the lineup").toBe(true);
      expect(disjoint(report.heading!.box, report.tileNav!.box), "tiles overlap the name").toBe(true);
    }

    if (mode === "lobby") {
      // Everything in the fold is visible without scrolling, above the 40px status strip.
      const fold = viewport.height - 40;
      for (const item of [...report.cards, ...report.tiles, report.heading!, report.actions!, report.explore!]) {
        expect(item.box.y, "top inside the first viewport").toBeGreaterThanOrEqual(56);
        expect(item.box.bottom, "bottom above the status strip").toBeLessThanOrEqual(fold + 0.5);
      }
      for (const tile of report.tiles) expect(tile.box.x).toBeGreaterThanOrEqual(valorant.right);
    }

    if (mode === "compact") {
      // Tiles form one row beneath the identity block and lineup.
      const rowTop = report.tiles[0].box.y;
      for (const tile of report.tiles) expect(Math.abs(tile.box.y - rowTop)).toBeLessThanOrEqual(1);
      expect(rowTop).toBeGreaterThanOrEqual(report.lineup!.box.bottom);
    }

    if (mode === "tablet") {
      // Two columns, with the third card spanning both at the same row height.
      expect(report.tiles).toHaveLength(0);
      expect(Math.abs(hermes.y - recolm.y)).toBeLessThanOrEqual(1);
      expect(hermes.right).toBeLessThanOrEqual(recolm.x);
      expect(valorant.y).toBeGreaterThanOrEqual(hermes.bottom);
      expect(Math.abs(valorant.x - hermes.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(valorant.right - recolm.right)).toBeLessThanOrEqual(1);
      expect(Math.abs(valorant.h - hermes.h)).toBeLessThanOrEqual(20);
    }

    if (mode === "mobile") {
      // One column in featured order.
      expect(hermes.y).toBeLessThan(recolm.y);
      expect(recolm.y).toBeLessThan(valorant.y);
      expect(Math.abs(hermes.x - recolm.x)).toBeLessThanOrEqual(1);
    }

    await context.close();
  });
}

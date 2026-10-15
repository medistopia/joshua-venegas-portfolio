import { mkdirSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { openPage, settle, verificationDir, viewports, type ViewportName } from "./helpers";

type Line = {
  text: string;
  color: [number, number, number, number];
  fontSize: number;
  fontWeight: number;
  box: { x0: number; y0: number; x1: number; y1: number };
};

type Result = {
  text: string;
  textColor: string;
  fontSize: number;
  large: boolean;
  required: number;
  minRatio: number;
  worstBackground: string;
  pixels: number;
};

mkdirSync(verificationDir, { recursive: true });

for (const viewport of Object.keys(viewports) as ViewportName[]) {
  test(`text contrast at actual positions, ${viewport}`, async ({ browser }) => {
    const { context, page } = await openPage(browser, viewport, "reduced");
    await settle(page);

    // One box per rendered line of every visible text node in the first viewport.
    const lines: Line[] = await page.evaluate(() => {
      const canvas = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
      const toRgba = (css: string, opacity: number): [number, number, number, number] => {
        canvas.clearRect(0, 0, 1, 1);
        canvas.fillStyle = css;
        canvas.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
        return [r, g, b, (a / 255) * opacity];
      };

      const out: Line[] = [];
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

        const range = document.createRange();
        range.selectNodeContents(node);
        for (const r of Array.from(range.getClientRects())) {
          const box = {
            x0: Math.max(0, r.left),
            y0: Math.max(0, r.top),
            x1: Math.min(innerWidth, r.right),
            y1: Math.min(innerHeight, r.bottom),
          };
          if (box.x1 - box.x0 < 2 || box.y1 - box.y0 < 2) continue;
          out.push({
            text: text.replace(/\s+/g, " ").slice(0, 60),
            color: toRgba(style.color, opacity),
            fontSize: parseFloat(style.fontSize),
            fontWeight: Number(style.fontWeight),
            box,
          });
        }
      }
      return out;
    });
    expect(lines.length).toBeGreaterThan(10);

    // Hide only the glyph fill so borders and backgrounds drawn with currentColor stay put.
    const hide = await page.addStyleTag({
      content: "* { -webkit-text-fill-color: transparent !important; text-shadow: none !important; text-decoration-color: transparent !important; caret-color: transparent !important; }",
    });
    const background = (await page.screenshot({ type: "png" })).toString("base64");
    await hide.evaluate((node) => (node as Element).remove());

    const results: Result[] = await page.evaluate(
      async ({ lines, background }) => {
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

        return lines.map((line) => {
          const x = Math.floor(line.box.x0 * scale);
          const y = Math.floor(line.box.y0 * scale);
          const w = Math.max(1, Math.floor((line.box.x1 - line.box.x0) * scale));
          const h = Math.max(1, Math.floor((line.box.y1 - line.box.y0) * scale));
          const data = ctx.getImageData(x, y, w, h).data;
          const [tr, tg, tb, ta] = line.color;

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

          const large = line.fontSize >= 24 || (line.fontSize >= 18.66 && line.fontWeight >= 700);
          return {
            text: line.text,
            textColor: `${hex(tr, tg, tb)}${ta < 1 ? ` at ${Math.round(ta * 100)}%` : ""}`,
            fontSize: line.fontSize,
            large,
            required: large ? 3 : 4.5,
            minRatio: Math.round(minRatio * 100) / 100,
            worstBackground: worst,
            pixels: data.length / 4,
          };
        });
      },
      { lines, background },
    );

    const failures = results.filter((r) => r.minRatio < r.required);
    writeFileSync(
      `${verificationDir}/contrast-${viewport}.json`,
      `${JSON.stringify(
        {
          viewport: viewports[viewport],
          method:
            "Minimum WCAG contrast between each rendered line's text color and every background pixel inside that line's box, captured with glyphs hidden. First viewport, reduced motion.",
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

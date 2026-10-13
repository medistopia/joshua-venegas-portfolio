"""Combine the Phase 1 captures into side-by-side comparison sheets.

Usage (from the repository root, after `npm run capture:composition`):
    python scripts/art/contact_sheet.py

Writes docs/verification/phase-1/comparison-guides.jpg and comparison-clean.jpg.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SHOTS = Path(__file__).resolve().parents[2] / "docs" / "verification" / "phase-1"
CANDIDATES = [("a", "A. Atrium (AI-generated)"), ("b", "B. Gallery (AI-generated)"), ("c", "C. Procedural hall (owned)")]
ROW_HEIGHT = 450
GAP = 16
LABEL = 36
BG = (7, 12, 22)
FG = (237, 234, 227)


def font(size):
    for name in ("segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def scaled(path):
    img = Image.open(path).convert("RGB")
    return img.resize((round(img.width * ROW_HEIGHT / img.height), ROW_HEIGHT), Image.LANCZOS)


def sheet(columns, out_name):
    rows = [[scaled(SHOTS / f"candidate-{cid}-{col}.jpg") for col in columns] for cid, _ in CANDIDATES]
    width = GAP + sum(img.width + GAP for img in rows[0])
    height = GAP + len(rows) * (LABEL + ROW_HEIGHT + GAP)
    canvas = Image.new("RGB", (width, height), BG)
    draw = ImageDraw.Draw(canvas)
    label_font = font(22)

    y = GAP
    for (_, title), images in zip(CANDIDATES, rows):
        draw.text((GAP, y + 4), title, fill=FG, font=label_font)
        x = GAP
        for img in images:
            canvas.paste(img, (x, y + LABEL))
            x += img.width + GAP
        y += LABEL + ROW_HEIGHT + GAP

    canvas.save(SHOTS / out_name, quality=85)
    print("wrote", SHOTS / out_name)


if __name__ == "__main__":
    sheet(["desktop-guides", "laptop-guides", "mobile-guides"], "comparison-guides.jpg")
    sheet(["desktop-clean"], "comparison-clean.jpg")

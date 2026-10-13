"""Measure hero text contrast against the art behind the text safe zone.

Reads the text-free safe-zone crops written by scripts/capture-composition.mjs
and reports the worst-case WCAG contrast for each hero text color, using the
98th-percentile background luminance (so a few stray bright pixels are ignored).

Usage (from the repository root, after `npm run capture:composition`):
    python scripts/art/measure_safe_zone.py
"""

from pathlib import Path

import numpy as np
from PIL import Image

CROPS = Path(__file__).resolve().parents[2] / "test-results" / "phase-1-safe-zone"

TEXT_COLORS = {
    "text #EDEAE3": (0xED, 0xEA, 0xE3),
    "gold #C9A55C": (0xC9, 0xA5, 0x5C),
}


def linear(channel):
    c = channel / 255
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def luminance(rgb):
    r, g, b = (linear(np.asarray(v, dtype=float)) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(l1, l2):
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def main():
    rows = []
    for crop in sorted(CROPS.glob("*.png")):
        px = np.asarray(Image.open(crop).convert("RGB"), dtype=float)
        lum = luminance((px[..., 0], px[..., 1], px[..., 2]))
        bg = float(np.percentile(lum, 98))
        ratios = {name: contrast(luminance(rgb), bg) for name, rgb in TEXT_COLORS.items()}
        rows.append((crop.stem, bg, ratios))

    header = "| Crop | Background luminance (p98) | " + " | ".join(TEXT_COLORS) + " |"
    print(header)
    print("|" + "---|" * (2 + len(TEXT_COLORS)))
    for name, bg, ratios in rows:
        cells = " | ".join(f"{r:.1f}:1" for r in ratios.values())
        print(f"| {name} | {bg:.3f} | {cells} |")


if __name__ == "__main__":
    main()

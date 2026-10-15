"""Render the procedural composition-study backdrop (candidate C).

A fully owned, reproducible alternative to sourced key art. The scene is a dark
one-point-perspective hall: a back wall, receding fins on the right wall, a
reflective floor, and one warm skylight beam that lands behind the lineup.

Usage (from the repository root):
    python scripts/art/render_backdrop.py

Writes:
    public/art/study/candidate-c-procedural-desktop.jpg  (2880 x 1620)
    public/art/study/candidate-c-procedural-mobile.jpg   (1290 x 2796)

Requires numpy and Pillow.
"""

from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

OUT_DIR = Path(__file__).resolve().parents[2] / "public" / "art" / "study"

DEEP = np.array([4, 7, 13]) / 255
NAVY = np.array([12, 20, 36]) / 255
WALL = np.array([20, 30, 48]) / 255
GOLD = np.array([255, 190, 112]) / 255
TEAL = np.array([61, 214, 196]) / 255


@dataclass
class Composition:
    width: int
    height: int
    focal_x: float  # beam centre, fraction of width
    horizon: float  # floor and back-wall junction, fraction of height
    pool_y: float  # where the beam meets the floor, fraction of height
    back_half_width: float  # half width of the back wall, fraction of width
    beam_top: float  # beam half width at the skylight, fraction of width
    beam_bottom: float  # beam half width at the floor, fraction of width
    fins: int
    seed: int


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def noise(h, w, rng, cells_y, cells_x, octaves=4):
    """Fractal value noise in [0, 1]; unequal cell counts give streaks."""
    out = np.zeros((h, w))
    amp, total = 1.0, 0.0
    for o in range(octaves):
        gy, gx = max(2, int(cells_y * 2**o)), max(2, int(cells_x * 2**o))
        grid = (rng.random((gy, gx)) * 255).astype(np.uint8)
        layer = Image.fromarray(grid).resize((w, h), Image.BICUBIC)
        out += amp * np.asarray(layer, dtype=float) / 255
        total += amp
        amp *= 0.5
    return out / total


def blur(channel, radius):
    img = Image.fromarray(np.clip(channel * 255, 0, 255).astype(np.uint8))
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius)), dtype=float) / 255


def render(c: Composition) -> Image.Image:
    rng = np.random.default_rng(c.seed)
    h, w = c.height, c.width
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    u, v = xx / w, yy / h
    aspect = w / h

    img = np.zeros((h, w, 3))

    # Base: dark ceiling falling into navy walls, floor darkening toward the viewer.
    wall_t = smoothstep(0.0, c.horizon, v)
    floor_t = smoothstep(c.horizon, 1.0, v)
    base = DEEP + (NAVY - DEEP) * wall_t[..., None]
    base = np.where((v > c.horizon)[..., None], NAVY + (DEEP - NAVY) * floor_t[..., None] * 0.9, base)
    img += base

    # Back wall: a slightly lighter recessed panel behind the beam.
    left, right = c.focal_x - c.back_half_width, c.focal_x + c.back_half_width
    in_back = ((u > left) & (u < right) & (v < c.horizon)).astype(float)
    in_back = blur(in_back, w / 300)
    texture = noise(h, w, rng, 18, 18 * aspect, octaves=3)
    img += in_back[..., None] * (WALL - NAVY) * (0.6 + 0.4 * texture[..., None])

    # Floor seams converging on the vanishing point ground the scene.
    below = np.clip(v - c.horizon, 1e-3, None)
    fx_persp = (u - c.focal_x) * aspect / below
    fz = 1.0 / below
    seams = np.exp(-((fx_persp * 2.2 - np.round(fx_persp * 2.2)) * below * 40) ** 2)
    seams += np.exp(-((fz * 0.35 - np.round(fz * 0.35)) / (fz * 0.012)) ** 2)
    img += (seams * (v > c.horizon) * smoothstep(c.horizon, c.horizon + 0.05, v) * 0.012)[..., None] * np.array([0.6, 0.7, 0.9])
    edge = np.exp(-((u - right) * w / 2.5) ** 2) + np.exp(-((u - left) * w / 2.5) ** 2)
    img += (edge * (v < c.horizon) * 0.05)[..., None] * GOLD

    # Right-wall fins in one-point perspective, rim-lit teal on the edge facing the beam.
    vx, vy = right, c.horizon
    for k in range(c.fins):
        s = 1.0 / (1.0 + 0.55 * k)  # 1 = nearest fin
        x0 = vx + (1.08 - vx) * s
        fin_w = 0.075 * s
        top = vy - vy * s * 1.05
        bottom = vy + (1 - vy) * s * 0.55
        inside = (u > x0 - fin_w) & (u < x0) & (v > top) & (v < bottom)
        shade = 0.55 + 0.45 * (1 - s)
        img = np.where(inside[..., None], WALL * shade, img)
        rim = np.exp(-(((u - (x0 - fin_w)) * w) / (3 + 4 * s)) ** 2) * (v > top) * (v < bottom)
        img += (rim * (0.10 + 0.25 * s) * (0.4 + 0.6 * texture))[..., None] * TEAL

    # Volumetric beam from a skylight slot, landing on the floor at pool_y.
    t = np.clip(v / c.pool_y, 0, 1)
    centre = c.focal_x + 0.012 * t
    half = c.beam_top + (c.beam_bottom - c.beam_top) * t
    dist = np.abs(u - centre) / half
    beam_mask = (1 - smoothstep(0.55, 1.0, dist)) * (v < c.pool_y + 0.01)
    streaks = noise(h, w, rng, 2, 60 * aspect, octaves=3)
    haze = noise(h, w, rng, 6, 6 * aspect, octaves=5)
    falloff = 0.55 + 0.45 * (1 - t) ** 1.5
    beam = beam_mask * falloff * (0.35 + 0.65 * streaks) * (0.5 + 0.5 * haze)
    img += (beam * 0.62)[..., None] * GOLD

    # Skylight aperture.
    slot = (np.abs(u - c.focal_x) < c.beam_top * 0.9) & (v < 0.035)
    img = np.where(slot[..., None], img + GOLD * 0.9, img)

    # Pool of light on the floor and its reflection streak.
    py = c.pool_y
    pool = np.exp(-(((u - centre) / (c.beam_bottom * 1.25)) ** 2 + ((v - py) / 0.035) ** 2))
    img += (pool * 0.55)[..., None] * GOLD
    reflect = np.exp(-((u - centre) / (c.beam_bottom * 0.6)) ** 2) * smoothstep(py, py + 0.02, v)
    reflect *= np.exp(-(v - py) / 0.18) * (0.5 + 0.5 * streaks)
    img += (reflect * 0.22)[..., None] * GOLD

    # Warm bounce on the back wall and a cool far haze at the horizon.
    bounce = np.exp(-(((u - c.focal_x) / 0.22) ** 2 + ((v - c.pool_y * 0.6) / 0.35) ** 2))
    img += (bounce * 0.07)[..., None] * GOLD
    far = np.exp(-((v - c.horizon) / 0.08) ** 2) * (0.5 + 0.5 * haze)
    img += (far * 0.035)[..., None] * np.array([0.45, 0.6, 0.8])

    # Dust in the beam.
    dust = np.zeros((h, w))
    n = int(w * h / 9000)
    dy = rng.integers(0, h, n)
    dx = rng.integers(0, w, n)
    dust[dy, dx] = rng.random(n)
    dust = blur(dust, 1.2) * 6 * beam_mask
    img += dust[..., None] * GOLD * 0.6

    # Bloom on the brightest values.
    lum = img.mean(axis=2)
    bright = np.clip(lum - 0.35, 0, 1)
    bloom = blur(bright, max(w, h) / 90)
    img += bloom[..., None] * GOLD * 0.9

    # Keep the text safe zone (left of the back wall on desktop) quiet.
    if aspect > 1:
        img *= (1 - 0.35 * (1 - smoothstep(0.0, left + 0.08, u)))[..., None]

    # Vignette, tone map, grain.
    r2 = ((u - c.focal_x) * aspect) ** 2 + ((v - c.pool_y * 0.5) * 1.0) ** 2
    img *= (1 - 0.55 * smoothstep(0.1, 1.6, r2))[..., None]
    img = img / (1 + 0.35 * img)
    img += rng.normal(0, 0.010, img.shape)

    return Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    desktop = Composition(
        width=2880, height=1620, focal_x=0.555, horizon=0.68, pool_y=0.78,
        back_half_width=0.19, beam_top=0.04, beam_bottom=0.13, fins=9, seed=7,
    )
    mobile = Composition(
        width=1290, height=2796, focal_x=0.5, horizon=0.33, pool_y=0.36,
        back_half_width=0.32, beam_top=0.045, beam_bottom=0.16, fins=6, seed=11,
    )
    render(desktop).save(OUT_DIR / "candidate-c-procedural-desktop.jpg", quality=88)
    render(mobile).save(OUT_DIR / "candidate-c-procedural-mobile.jpg", quality=88)
    print("wrote", OUT_DIR)


if __name__ == "__main__":
    main()

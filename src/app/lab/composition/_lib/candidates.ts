type Crop = {
  src: string;
  width: number;
  height: number;
  /** CSS object-position that lands the beam behind the center card. */
  position: string;
};

export type Candidate = {
  id: "a" | "b" | "c";
  name: string;
  description: string;
  source: string;
  desktop: Crop;
  mobile: Crop;
};

export const candidates: readonly Candidate[] = [
  {
    id: "a",
    name: "Atrium",
    description: "Brutalist concrete atrium, vertical skylight shaft, teal rim light on angled fins.",
    source: "AI-generated study art (Cursor image tool, 1280 x 720). Not final; license decision pending.",
    desktop: { src: "/art/study/candidate-a-atrium-desktop.jpg", width: 1280, height: 720, position: "17% 50%" },
    mobile: { src: "/art/study/candidate-a-atrium-mobile.jpg", width: 720, height: 1280, position: "50% 0%" },
  },
  {
    id: "b",
    name: "Gallery",
    description: "Faceted stone gallery, diagonal beam from a high slit window, reflective floor.",
    source: "AI-generated study art (Cursor image tool, 1280 x 720). Not final; license decision pending.",
    desktop: { src: "/art/study/candidate-b-gallery-desktop.jpg", width: 1280, height: 720, position: "47% 50%" },
    mobile: { src: "/art/study/candidate-b-gallery-mobile.jpg", width: 720, height: 1280, position: "50% 0%" },
  },
  {
    id: "c",
    name: "Procedural hall",
    description: "Code-rendered hall: skylight beam, back wall, perspective floor, teal-rimmed fins.",
    source: "Rendered by scripts/art/render_backdrop.py (2880 x 1620). Fully owned.",
    desktop: { src: "/art/study/candidate-c-procedural-desktop.jpg", width: 2880, height: 1620, position: "52% 50%" },
    mobile: { src: "/art/study/candidate-c-procedural-mobile.jpg", width: 1290, height: 2796, position: "50% 0%" },
  },
];

export const modes = ["guides", "clean"] as const;
export type Mode = (typeof modes)[number];

export function findCandidate(id: string) {
  return candidates.find((c) => c.id === id);
}

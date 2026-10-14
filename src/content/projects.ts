import { projectSchema, type Project } from "./schema";

export type { Project };

const hermes = projectSchema.parse({
  slug: "project-hermes",
  title: "Project Hermes",
  summary: "A Gmail-backed workspace for agents.",
  context: null,
  lineupPosition: "center",
  art: { need: "product-capture", src: null, alt: null },
});

const recolm = projectSchema.parse({
  slug: "recolm",
  title: "Recolm",
  summary: "A listing marketplace developed through JV Digital.",
  context: "JV Digital",
  lineupPosition: "left",
  art: { need: "product-capture", src: null, alt: null },
});

const valorantMl = projectSchema.parse({
  slug: "valorant-ml",
  title: "Valorant ML",
  summary: "Research involving competitive VALORANT data and predictive modeling.",
  context: "Research",
  lineupPosition: "right",
  art: { need: "research-chart", src: null, alt: null },
});

/** Featured order: document, keyboard, and mobile order. Hermes is the lead card. */
export const featured: readonly Project[] = [hermes, recolm, valorantMl];

/** Lab-only: the Phase 1 study renders the desktop row left to right. */
export const lineup: readonly Project[] = [recolm, hermes, valorantMl];

export function findProject(slug: string): Project | undefined {
  return featured.find((project) => project.slug === slug);
}

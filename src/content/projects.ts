export type ProjectArtNeed = "product-capture" | "research-chart";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  context: string | null;
  art: {
    need: ProjectArtNeed;
    src: string | null;
  };
};

export const projects = {
  recolm: {
    slug: "recolm",
    title: "Recolm",
    summary: "A listing marketplace developed through JV Digital.",
    context: "JV Digital",
    art: { need: "product-capture", src: null },
  },
  hermes: {
    slug: "project-hermes",
    title: "Project Hermes",
    summary: "A Gmail-backed workspace for agents.",
    context: null,
    art: { need: "product-capture", src: null },
  },
  valorantMl: {
    slug: "valorant-ml",
    title: "Valorant ML",
    summary: "Research involving competitive VALORANT data and predictive modeling.",
    context: "Research",
    art: { need: "research-chart", src: null },
  },
} satisfies Record<string, Project>;

/** Left to right on desktop; the middle entry is the raised lead card. */
export const lineup: readonly Project[] = [projects.recolm, projects.hermes, projects.valorantMl];

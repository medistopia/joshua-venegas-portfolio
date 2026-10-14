import { currentWork } from "@/content/current-work";
import { experience } from "@/content/experience";
import { people } from "@/content/people";
import { profile } from "@/content/profile";
import { allProjects, featured, findProject, type Project } from "@/content/projects";

/**
 * Layout decisions for the shell: which facts appear where, with which art and label. The facts
 * live in src/content. The art is AI-generated and approved to ship for now (docs/assets.md,
 * A2-lobby); it is replaced as product captures and research charts arrive.
 */
export type Art = { src: string; focus: string };

const art = (file: string, focus = "50% 50%"): Art => ({ src: `/art/lobby/${file}`, focus });

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${months[month - 1]} ${day}, ${year}`;
}

function requireProject(slug: string): Project {
  const project = findProject(slug);
  if (!project) throw new Error(`Unknown project ${slug}`);
  return project;
}

const workloadArt: Record<string, Art> = {
  foxtrot: art("current-foxtrot.jpg", "72% 50%"),
  "wei-research": art("current-research.jpg", "78% 50%"),
};

export type WorkloadItem = {
  id: string;
  title: string;
  description: string;
  link: { href: string; label: string } | null;
  art: Art;
};

export const workload: WorkloadItem[] = currentWork.map((item) => {
  const project = item.project ? requireProject(item.project) : null;
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    link: project ? { href: `/projects/${project.slug}`, label: `View ${project.title}` } : null,
    art: workloadArt[item.id],
  };
});

type Seat = "left" | "center" | "right";

const projectArt: Record<string, Art> = {
  "project-hermes": art("hermes-pennant.jpg", "50% 38%"),
  recolm: art("recolm-pennant.jpg", "50% 42%"),
  "valorant-ml": art("valorant-ml-pennant.jpg", "50% 50%"),
  "auto-research-agent": art("auto-research-agent-pennant.jpg", "50% 40%"),
  "lyn-desktop-companion": art("lyn-pennant.jpg", "50% 40%"),
};

export function artFor(slug: string): Art {
  const found = projectArt[slug];
  if (!found) throw new Error(`No art for ${slug}`);
  return found;
}

/** Short card label: where the work happened, or that it is an experiment. */
export function labelFor(project: Project): string | null {
  return project.context ?? (project.kind === "experiment" ? "Experiment" : null);
}

const seats: Record<string, Seat> = { recolm: "left", "project-hermes": "center", "valorant-ml": "right" };

export type PennantItem = { project: Project; rank: number; seat: Seat | null; label: string | null; art: Art };

/** Featured order (Hermes first) is the document and keyboard order; seats place it left to right. */
export const pennants: PennantItem[] = featured.map((project, i) => ({
  project,
  rank: i + 1,
  seat: seats[project.slug],
  label: labelFor(project),
  art: artFor(project.slug),
}));

/** The Projects view: featured work, then experiments. */
export const projectCards: PennantItem[] = allProjects.map((project, i) => ({
  project,
  rank: i + 1,
  seat: null,
  label: labelFor(project),
  art: artFor(project.slug),
}));
export type FeatureTileItem = { id: string; kicker: string; title: string; meta: string | null; href: string; art: Art };

const hermes = requireProject("project-hermes");
const aiLab = experience.find((item) => item.id === "ai-lab")!;
const hermesRelease = hermes.milestones[0];

export const featureTiles: FeatureTileItem[] = [
  {
    id: "hermes-release",
    kicker: "Update",
    title: `${hermes.title.replace(/^Project /, "")} Phase 1 release`,
    meta: `In production since ${formatDate(hermesRelease.date)}`,
    href: `/projects/${hermes.slug}`,
    art: art("tile-jv-digital.jpg", "50% 30%"),
  },
  {
    id: "ai-lab",
    kicker: "Experience",
    title: `${aiLab.organization} ${aiLab.role?.toLowerCase() ?? ""}`.trim(),
    meta: aiLab.detail,
    href: "/experience",
    art: art("tile-ai-lab.jpg", "50% 28%"),
  },
  {
    id: "education",
    kicker: "Education",
    title: "UNG computer science",
    meta: profile.expectedGraduation ? `Expected ${profile.expectedGraduation}` : null,
    href: "/about",
    art: art("tile-ung.jpg", "50% 72%"),
  },
];

export const collaboratorOrder = ["brandon-hall", "lai-wei", "yong-wei", "mohammad-mohebi"];

export const collaborators = collaboratorOrder.map((id) => {
  const person = people.find((p) => p.id === id);
  if (!person) throw new Error(`Unknown person ${id}`);
  return person;
});

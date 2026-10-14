import { currentWork } from "@/content/current-work";
import { experience } from "@/content/experience";
import { people } from "@/content/people";
import { profile } from "@/content/profile";
import { featured, findProject, type Project } from "@/content/projects";

/**
 * Layout decisions for the desktop lobby: which facts appear where, with which study art.
 * The facts themselves live in src/content. Study art is AI-generated for composition review
 * and does not ship without Joshua's decision (docs/assets.md, A2 and A6).
 */
export type Art = { src: string; focus: string };

const art = (file: string, focus = "50% 50%"): Art => ({ src: `/art/study/lobby/${file}`, focus });

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(iso: string) {
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

const seats: Record<string, { seat: Seat; art: Art }> = {
  recolm: { seat: "left", art: art("recolm-pennant.jpg", "50% 42%") },
  "project-hermes": { seat: "center", art: art("hermes-pennant.jpg", "50% 38%") },
  "valorant-ml": { seat: "right", art: art("valorant-ml-pennant.jpg", "50% 50%") },
};

export type PennantItem = { project: Project; rank: number; seat: Seat; label: string | null; art: Art };

/** Featured order (Hermes first) is the document and keyboard order; seats place it left to right. */
export const pennants: PennantItem[] = featured.map((project, i) => ({
  project,
  rank: i + 1,
  seat: seats[project.slug].seat,
  label: project.context,
  art: seats[project.slug].art,
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

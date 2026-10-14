import { currentWorkSchema } from "./schema";

/**
 * What Joshua is working on now, in his own wording. Foxtrot OS is the broader initiative; his
 * confirmed implementation work centers on Project Hermes, so nothing here claims the rest of it.
 */
export const currentWork = currentWorkSchema.array().parse([
  {
    id: "project-hermes",
    title: "Project Hermes",
    description:
      "Developing a Gmail-backed inbox and workspace for Foxtrot's agents as part of my work on the broader Foxtrot OS initiative.",
    project: "project-hermes",
    research: null,
    people: ["brandon-hall"],
  },
  {
    id: "wei-research",
    title: "Research",
    description: "Research with Dr. Lai Wei and Dr. Yong Wei.",
    project: null,
    research: "wei-research",
    people: ["lai-wei", "yong-wei"],
  },
]);

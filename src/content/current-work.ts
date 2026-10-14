import { currentWorkSchema } from "./schema";

/** What Joshua is working on now, in his own wording. */
export const currentWork = currentWorkSchema.array().parse([
  {
    id: "foxtrot",
    title: "Foxtrot",
    description: "Building and supporting Project Hermes with Foxtrot.",
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

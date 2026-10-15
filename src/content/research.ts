import { researchSchema } from "./schema";

/*
 * Earlier discussions covered machine learning for scientific discovery (materials research and
 * crystal-structure generation). That is background, not Joshua's project. Reviewing the language
 * model and crystallographic-file work associated with Brandon Hall and Dr. Yong Wei does not
 * establish that Joshua trained its models, authored the paper, or produced its results.
 * This research is also separate from his AI Lab role.
 */
export const research = researchSchema.array().parse([
  {
    id: "wei-research",
    title: "Research with Dr. Lai Wei and Dr. Yong Wei",
    people: ["lai-wei", "yong-wei"],
    projectTitle: null,
    responsibilities: [],
    methods: [],
    deliverables: [],
    currentMilestone: null,
  },
]);

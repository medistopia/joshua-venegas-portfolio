import { experienceItemSchema } from "./schema";

/** Dates stay null until Joshua confirms them. */
export const experience = experienceItemSchema.array().parse([
  {
    id: "ai-lab",
    role: "Team Leader",
    organization: "AI Lab",
    detail: null,
    dates: null,
  },
  {
    id: "jv-digital",
    role: "Founder",
    organization: "JV Digital",
    detail: "Recolm, a listing marketplace, was developed through JV Digital.",
    dates: null,
  },
  {
    id: "ung",
    role: "Computer science student, machine learning minor",
    organization: "University of North Georgia",
    detail: null,
    dates: null,
  },
]);

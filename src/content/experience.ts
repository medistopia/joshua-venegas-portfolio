import { experienceItemSchema } from "./schema";

/** Dates stay null until Joshua confirms them. */
export const experience = experienceItemSchema.array().parse([
  {
    id: "ai-lab",
    role: "Team Leader",
    organization: "AI Lab",
    detail: "Under Prof. Mohammad Mohebi.",
    people: ["mohammad-mohebi"],
    dates: null,
  },
  {
    id: "foxtrot",
    role: null,
    organization: "Foxtrot",
    detail: "Collaboration with Brandon Hall, including Project Hermes.",
    people: ["brandon-hall"],
    dates: null,
  },
  {
    id: "jv-digital",
    role: "Founder",
    organization: "JV Digital",
    detail: "Recolm, a listing marketplace, was developed through JV Digital.",
    people: [],
    dates: null,
  },
  {
    id: "ung",
    role: "Computer science student, machine learning minor",
    organization: "University of North Georgia",
    detail: "Expected graduation: Spring 2027.",
    people: [],
    dates: null,
  },
]);

import { experienceItemSchema } from "./schema";

/*
 * Dates stay null until Joshua confirms them. The Foxtrot entry uses the title from his offer
 * letter only; compensation, terms, and the systems the letter lists are not published.
 */
export const experience = experienceItemSchema.array().parse([
  {
    id: "foxtrot",
    role: "Software Engineer",
    organization: "Foxtrot",
    team: "Special Projects Group",
    detail: "Work includes Project Hermes, in collaboration with Brandon Hall.",
    people: ["brandon-hall"],
    dates: null,
  },
  {
    id: "ai-lab",
    role: "Team Leader",
    organization: "AI Lab",
    team: null,
    detail: "Under Prof. Mohammad Mohebi.",
    people: ["mohammad-mohebi"],
    dates: null,
  },
  {
    id: "jv-digital",
    role: "Founder",
    organization: "JV Digital",
    team: null,
    detail: "Recolm, a listing marketplace, was developed through JV Digital.",
    people: [],
    dates: null,
  },
  {
    id: "ung",
    role: "Computer science student, machine learning minor",
    organization: "University of North Georgia",
    team: null,
    detail: "Expected graduation: Spring 2027.",
    people: [],
    dates: null,
  },
]);

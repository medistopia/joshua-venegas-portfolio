import { experienceItemSchema } from "./schema";

/*
 * Dates stay null until Joshua confirms them. The Foxtrot entry uses the title from his offer
 * letter only; compensation and terms are not published. Foxtrot OS is named as the broader
 * initiative his work is associated with; the other systems the letter lists are not described,
 * because no specific contributions to them are confirmed. The highlights summarize the confirmed
 * Project Hermes contributions in Joshua's wording.
 */
export const experience = experienceItemSchema.array().parse([
  {
    id: "foxtrot",
    role: "Software Engineer",
    organization: "Foxtrot",
    team: "Special Projects Group",
    detail:
      "Foxtrot OS is the broader platform initiative associated with my work in Foxtrot's Special Projects Group. My confirmed implementation work so far centers on Project Hermes, in collaboration with Brandon Hall.",
    highlights: [
      "Google Workspace sign-in and organization access",
      "Gmail thread reading and reply composition",
      "Contacts, deals, and conversation linking",
      "Inbox layout, keyboard interactions, loading states, and error handling",
      "Session isolation, OAuth handling, logging safeguards, and recipient validation",
      "Automated testing, release verification, and operational documentation",
      "Phase 1 production release on October 8, 2026, followed by pilot support",
    ],
    people: ["brandon-hall"],
    dates: null,
  },
  {
    id: "ai-lab",
    role: "Team Leader",
    organization: "AI Lab",
    team: null,
    detail: "Under Prof. Mohammad Mohebi.",
    highlights: [],
    people: ["mohammad-mohebi"],
    dates: null,
  },
  {
    id: "jv-digital",
    role: "Founder",
    organization: "JV Digital",
    team: null,
    detail: "Recolm, a listing marketplace, was developed through JV Digital.",
    highlights: [],
    people: [],
    dates: null,
  },
  {
    id: "ung",
    role: "Computer science student, machine learning minor",
    organization: "University of North Georgia",
    team: null,
    detail: "Expected graduation: Spring 2027.",
    highlights: [],
    people: [],
    dates: null,
  },
]);

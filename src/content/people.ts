import { personSchema, type Person } from "./schema";

/** Portraits, biographies, and links stay empty until each has a confirmed source. */
export const people = personSchema.array().parse([
  {
    id: "brandon-hall",
    name: "Brandon Hall",
    initials: "BH",
    context: "Foxtrot",
    relationship: "I collaborate with Brandon at Foxtrot. My work there includes Project Hermes.",
    bio: null,
    portrait: null,
    links: [],
  },
  {
    id: "lai-wei",
    name: "Dr. Lai Wei",
    initials: "LW",
    context: "Research",
    relationship: "My current research involvement is with Dr. Lai Wei and Dr. Yong Wei.",
    bio: null,
    portrait: null,
    links: [],
  },
  {
    id: "yong-wei",
    name: "Dr. Yong Wei",
    initials: "YW",
    context: "Research",
    relationship: "My current research involvement is with Dr. Lai Wei and Dr. Yong Wei.",
    bio: null,
    portrait: null,
    links: [],
  },
  {
    id: "mohammad-mohebi",
    name: "Prof. Mohammad Mohebi",
    initials: "MM",
    context: "AI Lab",
    relationship: "I'm a team leader in the AI Lab under Prof. Mohebi. This is separate from my research with Dr. Lai Wei and Dr. Yong Wei.",
    bio: null,
    portrait: null,
    links: [],
  },
]);

export function findPerson(id: string): Person | undefined {
  return people.find((person) => person.id === id);
}

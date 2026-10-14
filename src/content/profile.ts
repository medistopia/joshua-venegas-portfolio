import { profileSchema } from "./schema";

export const profile = profileSchema.parse({
  name: { first: "Joshua", last: "Venegas" },
  eyebrow: "UNG // Computer Science + ML Minor",
  headline: "I build practical software and applied machine learning systems.",
  interests: ["Software engineering", "Applied machine learning", "Building useful systems"],
  roles: ["AI Lab Team Leader", "Founder, JV Digital"],
  education: "University of North Georgia, computer science with a machine learning minor",
  expectedGraduation: "Spring 2027",
  about: [
    "I'm a computer science student at the University of North Georgia with a minor in machine learning.",
    "I'm an AI Lab team leader and the founder of JV Digital, through which Recolm, a listing marketplace, was developed.",
  ],
  links: {
    resume: null,
    email: null,
    github: null,
    linkedin: null,
  },
});

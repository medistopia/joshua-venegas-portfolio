import { z } from "zod";

/**
 * Factual content only. Layout decisions (lineup position, lobby art, labels) live with the
 * components that make them. Unconfirmed values are null or empty and are not rendered.
 */
const confirmed = <T extends z.ZodType>(schema: T) => schema.nullable();

const text = z.string().min(1);
const isoDate = z.iso.date();

export const profileSchema = z.object({
  name: z.object({ first: text, last: text }),
  eyebrow: text,
  headline: text,
  interests: z.array(text),
  roles: z.array(text).min(1),
  education: text,
  expectedGraduation: confirmed(text),
  about: z.array(text).min(1),
  links: z.object({
    resume: confirmed(text),
    email: confirmed(z.email()),
    github: confirmed(z.url()),
    linkedin: confirmed(z.url()),
  }),
});

export const personSchema = z.object({
  id: text,
  name: text,
  initials: text.max(3),
  /** Short tag for the context Joshua knows them from. */
  context: text,
  /** Joshua's own description of the relationship, first person. */
  relationship: text,
  bio: confirmed(text),
  portrait: confirmed(text),
  links: z.array(z.object({ label: text, href: z.url() })),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: text,
  kind: z.enum(["project", "research", "experiment"]),
  /** One short sentence for cards. */
  summary: text,
  /** Fuller framing for the project view. */
  description: confirmed(text),
  context: confirmed(text),
  client: confirmed(
    z.object({
      name: text,
      /** Naming the client publicly needs their written permission (docs/assets.md). */
      nameApproved: z.boolean(),
    }),
  ),
  /** Person ids from people.ts. */
  people: z.array(text),
  stack: z.array(text),
  /** Work Joshua says he contributed to. Never derived from the stack. */
  contributions: z.array(text),
  /** What the system involves, for projects where Joshua's own part is not yet described. */
  components: z.array(text),
  status: confirmed(text),
  milestones: z.array(z.object({ label: text, date: isoDate })),
  outcomes: z.array(text),
  art: z.object({
    need: z.enum(["product-capture", "research-chart"]),
    src: confirmed(text),
    alt: confirmed(text),
  }),
});

export const researchSchema = z.object({
  id: text,
  title: text,
  people: z.array(text),
  projectTitle: confirmed(text),
  responsibilities: z.array(text),
  methods: z.array(text),
  deliverables: z.array(text),
  currentMilestone: confirmed(text),
});

export const currentWorkSchema = z.object({
  id: text,
  title: text,
  description: text,
  /** A project slug or research id this item points to. */
  project: confirmed(text),
  research: confirmed(text),
  people: z.array(text),
});

export const experienceItemSchema = z.object({
  id: text,
  role: confirmed(text),
  organization: text,
  detail: confirmed(text),
  people: z.array(text),
  dates: confirmed(text),
});

export type Profile = z.infer<typeof profileSchema>;
export type Person = z.infer<typeof personSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Research = z.infer<typeof researchSchema>;
export type CurrentWork = z.infer<typeof currentWorkSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;

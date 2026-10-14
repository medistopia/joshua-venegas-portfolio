import { z } from "zod";

/** Unconfirmed values are null and the components that use them render nothing. */
const confirmed = <T extends z.ZodType>(schema: T) => schema.nullable();

export const profileSchema = z.object({
  name: z.object({ first: z.string().min(1), last: z.string().min(1) }),
  eyebrow: z.string().min(1),
  headline: z.string().min(1),
  roles: z.array(z.string().min(1)).min(1),
  education: z.string().min(1),
  about: z.array(z.string().min(1)).min(1),
  links: z.object({
    resume: confirmed(z.string().min(1)),
    email: confirmed(z.email()),
    github: confirmed(z.url()),
    linkedin: confirmed(z.url()),
  }),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  context: confirmed(z.string().min(1)),
  /** Where the card sits in the desktop lineup. Document order is the featured order. */
  lineupPosition: z.enum(["left", "center", "right"]),
  art: z.object({
    need: z.enum(["product-capture", "research-chart"]),
    src: confirmed(z.string().min(1)),
    alt: confirmed(z.string().min(1)),
  }),
});

export const experienceItemSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  organization: z.string().min(1),
  detail: confirmed(z.string().min(1)),
  dates: confirmed(z.string().min(1)),
});

export type Profile = z.infer<typeof profileSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;

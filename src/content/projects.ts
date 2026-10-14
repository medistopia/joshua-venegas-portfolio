import { projectSchema, type Project } from "./schema";

export type { Project };

/*
 * Hermes is software for agents who use Gmail. It does not send email on its own and is not an
 * AI agent platform. No adoption, user counts, time savings, or business impact are claimed.
 */
const hermes = projectSchema.parse({
  slug: "project-hermes",
  title: "Project Hermes",
  kind: "project",
  summary: "A Gmail-backed inbox and workspace for Foxtrot's agents.",
  description:
    "A Gmail-backed inbox and workspace for Foxtrot's agents, developed as part of my work on Foxtrot OS, the broader platform initiative associated with Foxtrot's Special Projects Group. My confirmed implementation work so far centers on Hermes.",
  context: "Foxtrot",
  client: null,
  people: ["brandon-hall"],
  stack: ["Next.js", "TypeScript", "Supabase", "Google Workspace sign-in", "Gmail API", "Vercel"],
  contributions: [
    "Protected sign-in and organization access",
    "Reading Gmail threads and composing replies",
    "Contacts, deals, and linking conversations to contacts",
    "Inbox layout, keyboard interactions, loading states, and error handling",
    "Session isolation between environments",
    "OAuth refusal and revocation handling",
    "Logging safeguards and operational documentation",
    "Reply-recipient validation that shows the destination and refuses unsafe or ambiguous sends",
    "Automated testing and production release verification",
  ],
  components: [],
  status: "Pilot support and follow-up work",
  milestones: [{ label: "Phase 1 production release", date: "2026-10-08" }],
  outcomes: [],
  art: { need: "product-capture", src: null, alt: null },
});

/* Product engineering and workflow decisions; no revenue, traffic, conversion, or customer metrics. */
const recolm = projectSchema.parse({
  slug: "recolm",
  title: "Recolm",
  kind: "project",
  summary: "A listing marketplace developed through JV Digital.",
  description: null,
  context: "JV Digital",
  client: { name: "Brandon Smith", nameApproved: false },
  people: [],
  stack: ["Next.js", "Clerk", "Stripe", "Prisma", "Neon Postgres", "Cloudflare R2", "Hostinger"],
  contributions: [
    "Listing creation and payment",
    "Moderation",
    "Seller dashboards and profiles",
    "Video approval",
    "Search and filters",
    "Featured listings",
    "Expiration and relisting",
    "SEO",
  ],
  components: [],
  status: null,
  milestones: [],
  outcomes: [],
  art: { need: "product-capture", src: null, alt: null },
});

/* An investigation of prediction and generalization over time; no accuracy or betting claims. */
const valorantMl = projectSchema.parse({
  slug: "valorant-ml",
  title: "Valorant ML",
  kind: "research",
  summary: "Applied ML research on prediction and generalization over time.",
  description:
    "Applied machine learning research involving competitive VALORANT match data: an investigation into prediction and generalization over time.",
  context: "Research",
  client: null,
  people: [],
  stack: ["XGBoost"],
  contributions: [
    "Predictive modeling with XGBoost",
    "Leakage-aware features",
    "Walk-forward evaluation",
    "ROC AUC and Brier score analysis",
  ],
  components: [],
  status: null,
  milestones: [],
  outcomes: [],
  art: { need: "research-chart", src: null, alt: null },
});

const autoResearchAgent = projectSchema.parse({
  slug: "auto-research-agent",
  title: "Auto Research Agent",
  kind: "experiment",
  summary: "A research discovery and retrieval system.",
  description: null,
  context: null,
  client: null,
  people: [],
  stack: ["Python", "FastAPI", "React"],
  contributions: [],
  components: ["Paper ingestion", "Metadata", "Transformer embeddings", "Semantic search"],
  status: "Experiment",
  milestones: [],
  outcomes: [],
  art: { need: "product-capture", src: null, alt: null },
});

const lyn = projectSchema.parse({
  slug: "lyn-desktop-companion",
  title: "Lyn Desktop Companion",
  kind: "experiment",
  summary: "An experimental Electron desktop companion.",
  description: null,
  context: null,
  client: null,
  people: [],
  stack: ["Electron"],
  contributions: [],
  components: ["Local models", "Voice tools", "Reminders", "Memory"],
  status: "Experiment",
  milestones: [],
  outcomes: [],
  art: { need: "product-capture", src: null, alt: null },
});

/** Joshua's priority order for featured work: Hermes, Recolm, Valorant ML. */
export const featured: readonly Project[] = [hermes, recolm, valorantMl];

export const experiments: readonly Project[] = [autoResearchAgent, lyn];

export const allProjects: readonly Project[] = [...featured, ...experiments];

export function findProject(slug: string): Project | undefined {
  return allProjects.find((project) => project.slug === slug);
}

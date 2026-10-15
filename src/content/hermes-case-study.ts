import { z } from "zod";

/** Claim provenance and historical verification limits: docs/content-dossier.md, H1–H7.
 * Repository behavior corroborates Joshua's supplied contribution scope, not sole authorship.
 * Deliberately excludes operational identifiers, customer data and private repository links.
 */
const sectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
});

const systemSchema = z.enum(["hermes", "gmail", "supabase"]);

const caseStudySchema = z
  .object({
    overview: z.object({
      problem: z.string().min(1),
      role: z.string().min(1),
      delivered: z.string().min(1),
      decisions: z
        .array(z.object({ section: z.string().min(1), title: z.string().min(1), summary: z.string().min(1) }))
        .length(3),
    }),
    workflow: z.object({
      systems: z.array(z.object({ id: systemSchema, name: z.string().min(1), role: z.string().min(1) })).length(3),
      steps: z.array(z.object({ id: z.string().min(1), system: systemSchema, title: z.string().min(1), detail: z.string().min(1) })).min(2),
      review: z.object({ from: z.string().min(1), to: z.string().min(1), title: z.string().min(1), detail: z.string().min(1) }),
      description: z.string().min(1),
    }),
    sections: z.array(sectionSchema).min(1),
    note: z.string().min(1),
  })
  .superRefine(({ overview, workflow, sections }, ctx) => {
    const sectionIds = new Set(sections.map((section) => section.id));
    for (const decision of overview.decisions) {
      if (!sectionIds.has(decision.section)) ctx.addIssue({ code: "custom", message: `Unknown section ${decision.section}` });
    }
    const stepIds = workflow.steps.map((step) => step.id);
    const from = stepIds.indexOf(workflow.review.from);
    const to = stepIds.indexOf(workflow.review.to);
    if (from < 0 || to < 0 || to >= from) ctx.addIssue({ code: "custom", message: "The review path must return to an earlier step" });
  });

export type CaseStudy = z.infer<typeof caseStudySchema>;
export type WorkflowSystem = z.infer<typeof systemSchema>;

export const hermesCaseStudy = caseStudySchema.parse({
  overview: {
    problem:
      "Foxtrot's agents answer Gmail conversations that belong to specific contacts and deals. Hermes keeps that context beside the thread, so reading, linking and replying happen in one workspace.",
    role:
      "Software Engineer in Foxtrot's Special Projects Group, working with Brandon Hall. My work covers sign-in and access, Gmail reading and replies, contacts, deals and conversation linking, the inbox's interface states, and the safeguards, tests and release documentation around them. This covers my Hermes work, not every system in Foxtrot OS.",
    delivered:
      "A desktop-first Phase 1 workspace: protected sign-in, Gmail threads, linked contact and deal context, and single-recipient replies that the server rechecks before sending.",
    decisions: [
      {
        section: "sessions",
        title: "Session boundaries",
        summary: "Sessions are bound to the environment that issued them, and access fails closed when the environment is unknown.",
      },
      {
        section: "oauth",
        title: "OAuth refusal",
        summary: "A refused sign-in attempts to revoke the grant it received, and the refusal stands even if revocation fails.",
      },
      {
        section: "recipients",
        title: "Recipient recheck",
        summary: "The server rereads the thread before sending and returns the conversation for review if the destination changed.",
      },
    ],
  },
  workflow: {
    systems: [
      { id: "hermes", name: "Hermes", role: "Interface and server routes on Vercel. Checks the session and the recipient." },
      { id: "gmail", name: "Gmail", role: "Mail storage and delivery. Threads are read and replies sent through the Gmail API." },
      { id: "supabase", name: "Supabase", role: "Hermes's own records: contacts, deals and conversation links." },
    ],
    steps: [
      {
        id: "sign-in",
        system: "hermes",
        title: "Protected sign-in",
        detail: "Google Workspace identity, an allowed organization domain and a session bound to its environment.",
      },
      { id: "thread", system: "gmail", title: "Gmail thread", detail: "The agent opens a conversation, read from Gmail." },
      {
        id: "context",
        system: "supabase",
        title: "Contact and deal context",
        detail: "The linked contact and its deals appear beside the thread. Linking records the relationship only.",
      },
      { id: "composer", system: "hermes", title: "Reply composer", detail: "Shows the single destination the reply will go to." },
      {
        id: "recheck",
        system: "hermes",
        title: "Server recipient recheck",
        detail: "On send, the server rereads the thread and compares its destination with the one shown.",
      },
      { id: "send", system: "gmail", title: "Gmail send", detail: "The server builds the reply and Gmail delivers it." },
    ],
    review: {
      from: "recheck",
      to: "composer",
      title: "Changed or missing recipient",
      detail: "Nothing is sent. The current conversation returns to the composer for review.",
    },
    description:
      "After protected sign-in, the agent opens a Gmail thread with its linked contact and deal context from Supabase beside it, and writes a reply in a composer that shows one destination. When the agent sends, the Hermes server rereads the thread and checks that destination again. If it still matches, Gmail sends the reply. If it changed or is missing, nothing is sent and the current conversation returns to the composer for review. Gmail stores and delivers the mail; Supabase holds only Hermes's records.",
  },
  sections: [
    {
      id: "architecture",
      title: "Architecture and boundaries",
      paragraphs: [
        "Hermes is a Next.js and TypeScript application whose interface and server routes are deployed through Vercel. Google Workspace supplies identity, the Gmail API supplies thread reading and sending, and Supabase stores contacts, deals and conversation links. Supabase access for agent records uses the verified session identity and row-level security.",
        "Gmail remains responsible for mail storage and delivery: linking a conversation records the relationship without moving the mail out of Gmail. Hermes adds working context around that mail; it is not an autonomous email agent. Loading and error states keep the agent informed when a request cannot finish.",
      ],
    },
    {
      id: "sessions",
      title: "Decision 1: make session boundaries explicit",
      paragraphs: [
        "A valid signature is not enough to decide where a session belongs. I worked on binding sessions to the environment that issued them, so a session from local development or preview is refused in production. The verifier also rechecks the account's verified organization-domain claim against the current access policy on every request.",
        "This adds a boundary beyond separate signing secrets. If the application cannot identify its environment, it refuses access rather than guessing. The tradeoff is deliberate: a configuration problem can interrupt access and must be diagnosed before service resumes. The boundary separates environment classes; it does not isolate every preview deployment from every other preview.",
      ],
    },
    {
      id: "oauth",
      title: "Decision 2: finish the refusal workflow",
      paragraphs: [
        "An OAuth callback may receive a grant before the application decides whether the account is allowed. Simply refusing sign-in would leave that grant unresolved. I worked on a refusal path that attempts revocation before returning the refusal, without establishing a session for the rejected account.",
        "A revocation failure does not make the account eligible. The refusal still stands, while bounded outcome logging supports diagnosis without including tokens or raw account details. Because a grant can be shared across environments, revocation can also force a reconnect elsewhere; Hermes handles that as an explicit reconnect flow rather than leaving a broken inbox on screen.",
      ],
    },
    {
      id: "recipients",
      title: "Decision 3: show the destination, then recheck it",
      paragraphs: [
        "A conversation can change while someone writes a reply. I worked on making the single reply destination visible in the composer and validating it again at send time. The composer and server share the same recipient-selection logic, and the server rereads the thread to compare the current destination with the one the agent saw.",
        "If that destination changed or disappeared, Hermes refuses the send and returns the current conversation for review instead of silently redirecting the draft. This costs an extra read and may require another confirmation from the agent, but makes a consequential action easier to inspect. The workflow is a single-recipient reply, not reply-all; unsupported or ambiguous cases fall back to Gmail.",
      ],
    },
    {
      id: "verification",
      title: "Verification and evidence",
      paragraphs: [
        "The repository contains targeted tests for cross-environment session rejection, OAuth callback refusal, reply construction, recipient changes and composer recovery, and logging tests check redaction. These exercise failure paths as well as the successful inbox workflow.",
        "Release work combined automated checks with signed-in browser verification and an operational runbook. Historical review records describe checks for sign-in, reading threads, session persistence, sign-out protection and reconnect behavior. They support this account but are not a new audit of the live system, and individual production checks carry their recorded limitations.",
      ],
    },
    {
      id: "status",
      title: "Scope and limits",
      paragraphs: [
        "Phase 1 is desktop-first and deliberately narrower than a full Gmail replacement. Its production milestone marks delivery of the initial workspace, not a claim about adoption, revenue or time saved.",
      ],
    },
    {
      id: "next",
      title: "Next steps",
      paragraphs: ["The current focus is pilot support and follow-up work on the Phase 1 workspace."],
    },
  ],
  note:
    "Technical details come from the Hermes source and its review history; private operational details, mailbox content and customer information are left out. Approved, sanitized product captures and a documented pilot outcome will be added when they are available.",
});

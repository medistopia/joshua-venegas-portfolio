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

export const hermesCaseStudy = z.array(sectionSchema).parse([
  {
    id: "problem",
    title: "An inbox with working context",
    paragraphs: [
      "Hermes gives Foxtrot's agents a Gmail-backed workspace with conversations, contacts and deals in one interface. The central workflow is to read a thread, connect it to the right contact, inspect the surrounding deal context and compose a reply.",
      "Gmail remains responsible for mail storage and delivery. Hermes adds the working context around that mail; it is not an autonomous email agent.",
    ],
  },
  {
    id: "role",
    title: "My role and collaboration",
    paragraphs: [
      "I am a Software Engineer in Foxtrot's Special Projects Group and collaborate with Brandon Hall. My implementation work covers sign-in and access controls, Gmail reading and replies, contacts and deals, conversation linking, and the inbox's keyboard, loading and error states.",
      "I also worked on session isolation, OAuth refusal and revocation handling, logging safeguards, reply-recipient validation, automated testing, release verification and operational documentation. Foxtrot OS is the broader platform initiative; this case study describes my work on Hermes, not ownership of every system in that initiative.",
    ],
  },
  {
    id: "workflow",
    title: "Architecture and workflow",
    paragraphs: [
      "The Next.js and TypeScript application combines the interface and server routes. Google Workspace supplies identity, the Gmail API supplies thread reading and sending, and Supabase stores contacts, deals and conversation links. The application is deployed through Vercel.",
      "After protected sign-in, an agent opens a Gmail thread in the central reading area. A linked contact supplies context alongside it, while a separate rail organizes deals. Supabase access for agent records uses the verified session identity and row-level security. Linking a conversation records the relationship without moving the underlying mail out of Gmail.",
      "The reply composer shows one destination. When the agent sends, the server reloads the conversation, validates the recipient and constructs the reply for Gmail. Loading and error states keep the agent informed when a request cannot finish.",
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
      "A revocation failure does not make the account eligible. The refusal still stands, while bounded outcome logging supports diagnosis without including tokens or raw account details. Because a grant can be shared across environments, revocation can also force a reconnect elsewhere. Hermes handles that as an explicit reconnect flow rather than leaving a broken inbox on screen.",
    ],
  },
  {
    id: "recipients",
    title: "Decision 3: show the destination, then recheck it",
    paragraphs: [
      "A conversation can change while someone writes a reply. I worked on making the single reply destination visible and validating it again at send time. The composer and server use the same recipient-selection logic; the server reloads the thread and compares the current destination with the one the agent saw.",
      "If that destination changes or disappears, Hermes refuses the send and returns the current conversation for review. It does not silently redirect the draft. This costs an extra read and may require another confirmation from the agent, but makes a consequential action easier to inspect. The workflow is a single-recipient reply, not reply-all; unsupported or ambiguous cases fall back to Gmail.",
    ],
  },
  {
    id: "verification",
    title: "Verification and evidence",
    paragraphs: [
      "The repository contains targeted tests for cross-environment session rejection, OAuth callback refusal, reply construction, recipient changes and composer recovery. Logging tests check redaction. These checks exercise failure paths as well as the successful inbox workflow.",
      "Release work combined automated checks with signed-in browser verification and an operational runbook. Historical review records describe checks for sign-in, reading threads, session persistence, sign-out protection and reconnect behavior. Those records support the release narrative; they are not a new audit of the live system, and individual production checks must be read with their recorded limitations.",
    ],
  },
  {
    id: "status",
    title: "Production milestone and limits",
    paragraphs: [
      "Phase 1 entered production on October 8, 2026, followed by pilot support. This milestone reflects delivery of the initial workspace, not a claim about adoption, revenue or time saved.",
      "The first phase is desktop-first and deliberately narrower than a full Gmail replacement. This portfolio uses illustrative artwork: no real mailbox, customer information or product capture is shown. The case study describes verified implementation patterns without exposing private operational details.",
    ],
  },
  {
    id: "next",
    title: "Next steps",
    paragraphs: [
      "The current focus is pilot support and follow-up work. For the next revision of this case study, I want to add approved, sanitized product captures and a concrete pilot example with a documented outcome. Until that evidence is available, the emphasis stays on the implemented workflow, engineering decisions and verification.",
    ],
  },
]);

import { profile } from "@/content/profile";
import { ButtonLink } from "./ButtonLink";

/** Only confirmed channels render. With none confirmed, a status line replaces the actions. */
export function ContactActions() {
  const { resume, email, github, linkedin } = profile.links;
  const actions = [
    email && { href: `mailto:${email}`, label: "Email" },
    linkedin && { href: linkedin, label: "LinkedIn" },
    github && { href: github, label: "GitHub" },
    resume && { href: resume, label: "Résumé" },
  ].filter((action): action is { href: string; label: string } => Boolean(action));

  if (actions.length === 0) {
    return (
      <p className="max-w-[52ch] text-text-muted">
        Public contact details are being finalized and will be listed here once confirmed.
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-3">
      {actions.map((action, i) => (
        <li key={action.label}>
          <ButtonLink href={action.href} variant={i === 0 ? "gold" : "line"}>
            {action.label}
          </ButtonLink>
        </li>
      ))}
    </ul>
  );
}

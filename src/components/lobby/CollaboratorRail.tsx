import { PeopleIcon } from "@/components/icons/Icons";
import { collaborators } from "./config";

/**
 * Far-right rail. Each person opens a popover with their relationship to Joshua's work and any
 * confirmed links. Initials stand in until a portrait is approved; there is no online status.
 */
export function CollaboratorRail() {
  return (
    <aside
      aria-labelledby="collaborators-heading"
      className="flex flex-col items-center gap-4 border-l border-line bg-bg-deep/75 py-5 backdrop-blur-sm"
    >
      <PeopleIcon className="size-5 text-text-muted" />
      <h2 id="collaborators-heading" className="label rotate-180 text-text-muted [writing-mode:vertical-rl]">
        Collaborators
      </h2>
      <ul className="flex flex-col gap-2.5">
        {collaborators.map((person) => {
          const popoverId = `person-${person.id}`;
          return (
            <li key={person.id}>
              <button
                type="button"
                popoverTarget={popoverId}
                className="group relative grid size-10 place-items-center font-display text-base font-bold tracking-wide text-text"
              >
                <span
                  aria-hidden="true"
                  className="clip-notch absolute inset-0 bg-line-strong transition-colors duration-(--dur-fast) group-hover:bg-teal"
                />
                <span aria-hidden="true" className="clip-notch absolute inset-px bg-surface-solid" />
                <span aria-hidden="true" className="relative">
                  {person.initials}
                </span>
                <span className="sr-only">{person.name}</span>
              </button>
              <div
                id={popoverId}
                popover="auto"
                className="fixed inset-auto m-0 mr-3 w-72 border border-line-strong bg-surface-solid p-4 text-text [position-area:left_span-bottom]"
              >
                <p className="label text-gold">{person.context}</p>
                <p className="mt-1.5 font-display text-2xl leading-none font-bold uppercase">{person.name}</p>
                <p className="mt-3 text-sm leading-snug text-text-muted">{person.relationship}</p>
                {person.links.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-1">
                    {person.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className="label text-teal underline-offset-4 hover:underline">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

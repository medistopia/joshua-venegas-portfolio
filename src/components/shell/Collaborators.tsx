import { PeopleIcon } from "@/components/icons/Icons";
import { collaborators } from "@/components/lobby/config";
import type { Person } from "@/content/schema";

/**
 * Each person opens a popover with their relationship to Joshua's work and any confirmed links.
 * Initials stand in until a portrait is approved; there is no online status.
 */
function PersonPopover({ person, id, anchored }: { person: Person; id: string; anchored: boolean }) {
  return (
    <div
      id={id}
      popover="auto"
      role="dialog"
      aria-labelledby={`${id}-name`}
      className={`collaborator-popover w-72 max-w-[calc(100vw-2rem)] border border-line-strong bg-surface-solid p-4 text-text backdrop:bg-bg-deep/40 ${
        anchored ? "fixed inset-auto m-0 mr-3 [position-area:left_span-bottom]" : "m-auto"
      }`}
    >
      <p className="label text-gold">{person.context}</p>
      <p id={`${id}-name`} className="mt-1.5 font-display text-2xl leading-none font-bold uppercase">{person.name}</p>
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
      <button
        type="button"
        popoverTarget={id}
        popoverTargetAction="hide"
        className="label mt-4 border border-line-strong px-3 py-1.5 text-text-muted transition-colors duration-(--dur-fast) hover:border-text hover:text-text"
      >
        Close
      </button>
    </div>
  );
}

function Initials({ person }: { person: Person }) {
  return (
    <span className="relative grid size-10 shrink-0 place-items-center font-display text-base font-bold tracking-wide text-text">
      <span
        aria-hidden="true"
        className="clip-notch absolute inset-0 bg-line-strong transition-colors duration-(--dur-fast) group-hover:bg-teal"
      />
      <span aria-hidden="true" className="clip-notch absolute inset-px bg-surface-solid" />
      <span aria-hidden="true" className="relative">
        {person.initials}
      </span>
    </span>
  );
}

/** Desktop: the far-right rail, present in every view. */
export function CollaboratorRail() {
  return (
    <aside
      aria-labelledby="collaborators-rail-heading"
      className="hidden w-14 shrink-0 flex-col items-center gap-4 border-l border-line bg-bg-deep/75 py-5 backdrop-blur-sm lg:flex"
    >
      <PeopleIcon className="size-5 text-text-muted" />
      <h2 id="collaborators-rail-heading" className="label rotate-180 text-text-muted [writing-mode:vertical-rl]">
        Collaborators
      </h2>
      <ul className="flex flex-col gap-2.5">
        {collaborators.map((person) => {
          const id = `rail-${person.id}`;
          return (
            <li key={person.id}>
              <button type="button" popoverTarget={id} className="group block">
                <Initials person={person} />
                <span className="sr-only">{person.name}</span>
              </button>
              <PersonPopover person={person} id={id} anchored />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

/** Below 1024px: a section at the end of the lobby. */
export function CollaboratorStrip() {
  return (
    <section aria-labelledby="collaborators-strip-heading" className="flex flex-col gap-4 lg:hidden">
      <h2 id="collaborators-strip-heading" className="label flex items-center gap-2 text-text-muted">
        <PeopleIcon className="size-4" />
        Collaborators
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {collaborators.map((person) => {
          const id = `strip-${person.id}`;
          return (
            <li key={person.id}>
              <button
                type="button"
                popoverTarget={id}
                className="group flex w-full items-center gap-3 border border-line bg-surface p-2 text-left transition-colors duration-(--dur-fast) hover:border-teal"
              >
                <Initials person={person} />
                <span className="flex min-w-0 flex-col">
                  <span className="font-display text-lg leading-tight font-semibold uppercase">{person.name}</span>
                  <span className="label text-text-muted">{person.context}</span>
                </span>
              </button>
              <PersonPopover person={person} id={id} anchored={false} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import { experience } from "@/content/experience";

/** Match-history rows. Dates render only once confirmed. */
export function ExperienceRows() {
  return (
    <ul className="flex flex-col gap-2">
      {experience.map((item) => (
        <li
          key={item.id}
          className="grid grid-cols-[3px_1fr] border border-line bg-surface-solid sm:grid-cols-[3px_minmax(0,1fr)_auto]"
        >
          <span aria-hidden="true" className="bg-gold" />
          <div className="flex flex-col gap-1 px-4 py-3">
            <p className="label text-gold">{item.organization}</p>
            {item.role && <p className="font-display text-2xl leading-tight font-semibold uppercase">{item.role}</p>}
            {item.detail && <p className="text-sm text-text-muted">{item.detail}</p>}
          </div>
          {item.dates && <p className="label self-center px-4 py-3 text-text-muted">{item.dates}</p>}
        </li>
      ))}
    </ul>
  );
}

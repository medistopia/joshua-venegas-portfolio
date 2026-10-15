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
            <p className="label text-gold">
              {item.organization}
              {item.team && <span className="text-text-muted"> · {item.team}</span>}
            </p>
            {item.role && <p className="font-display text-2xl leading-tight font-semibold uppercase">{item.role}</p>}
            {item.detail && <p className="max-w-[68ch] text-sm text-text-muted">{item.detail}</p>}
            {item.highlights.length > 0 && (
              <ul aria-label={`${item.organization} work`} className="mt-2 grid gap-x-6 gap-y-1.5 text-sm md:grid-cols-2">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="grid grid-cols-[10px_1fr] items-baseline gap-2 leading-snug">
                    <span aria-hidden="true" className="size-1.5 -translate-y-px rotate-45 bg-teal" />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {item.dates && <p className="label self-center px-4 py-3 text-text-muted">{item.dates}</p>}
        </li>
      ))}
    </ul>
  );
}

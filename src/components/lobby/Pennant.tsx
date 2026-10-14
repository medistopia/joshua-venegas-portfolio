import Image from "next/image";
import Link from "next/link";
import type { PennantItem } from "./config";

const seatOrder = { left: "order-1", center: "order-2 z-10", right: "order-3" } as const;

/** Lobby pennant: artwork across the card, a short label and the title. The summary lives in the project view. */
export function Pennant({ item }: { item: PennantItem }) {
  const { project, rank, seat, label, art } = item;
  const lead = seat === "center";
  const titleId = `${project.slug}-pennant-title`;
  const labelId = `${project.slug}-pennant-label`;

  return (
    <li className={`relative ${seatOrder[seat]} ${seat === "left" ? "-mr-4" : seat === "right" ? "-ml-4" : ""}`}>
      <Link
        href={`/projects/${project.slug}`}
        prefetch
        aria-labelledby={titleId}
        aria-describedby={label ? labelId : undefined}
        className={`group relative block @container outline-offset-4 transition-transform duration-(--dur-base) ease-(--ease-out) hover:translate-y-(--move-lift) focus-visible:translate-y-(--move-lift) ${
          lead
            ? "h-(--pennant-h) w-[calc(var(--pennant-h)/2)]"
            : "mt-[calc(var(--pennant-h)*0.05)] h-[calc(var(--pennant-h)*0.9)] w-[calc(var(--pennant-h)*0.45)]"
        }`}
      >
        <span
          aria-hidden="true"
          className="label absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 border border-gold bg-bg-deep px-2 py-0.5 text-gold"
        >
          {String(rank).padStart(2, "0")}
        </span>

        <span
          aria-hidden="true"
          className={`clip-pennant absolute inset-0 transition-colors duration-(--dur-fast) group-hover:bg-teal group-focus-visible:bg-teal ${
            lead ? "bg-text/80" : "bg-line-strong"
          }`}
        />

        <span aria-hidden="true" className="clip-pennant absolute inset-px overflow-hidden bg-bg-deep">
          <Image
            src={art.src}
            alt=""
            fill
            sizes={lead ? "270px" : "245px"}
            className="object-cover transition-transform duration-(--dur-slow) ease-(--ease-out) group-hover:scale-(--move-zoom) group-focus-visible:scale-(--move-zoom)"
            style={{ objectPosition: art.focus }}
          />
          {!lead && (
            <span className="absolute inset-0 bg-bg-deep/40 transition-opacity duration-(--dur-fast) group-hover:opacity-0 group-focus-visible:opacity-0" />
          )}
          <span className="scrim-pennant absolute inset-0" />
        </span>

        <span className="absolute inset-x-0 bottom-[52px] flex flex-col items-center gap-1.5 px-4 text-center">
          <span
            aria-hidden="true"
            className={`mb-2 h-0.5 w-full transition-colors duration-(--dur-fast) ${
              lead ? "bg-teal" : "bg-line-strong group-hover:bg-teal group-focus-visible:bg-teal"
            }`}
          />
          {label && (
            <span id={labelId} className="label text-gold">
              {label}
            </span>
          )}
          <span
            id={titleId}
            className={`font-display leading-none font-bold uppercase ${lead ? "text-2xl @min-[250px]:text-3xl" : "text-2xl"}`}
          >
            {project.title}
          </span>
        </span>

        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-[42px] w-full transition-colors duration-(--dur-fast) group-hover:text-teal group-focus-visible:text-teal ${
            lead ? "text-gold" : "text-line-strong"
          }`}
        >
          <polyline
            points="5,0 5,8 50,19 95,8 95,0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </Link>
    </li>
  );
}

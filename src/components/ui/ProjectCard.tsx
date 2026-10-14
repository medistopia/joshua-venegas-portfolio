import Link from "next/link";
import type { Project } from "@/content/projects";
import { ProjectArt } from "./ProjectArt";

type ProjectCardProps = {
  project: Project;
  /** Featured order, shown in the index badge. */
  rank: number;
  /** "lead" and "flank" are the desktop lineup sizes; every layout is 4:5 below lg. */
  layout: "lead" | "flank" | "grid";
  /** Spans both columns of the 640 to 1023px grid at 8:5, so its row matches the 4:5 cards' height. */
  wide?: boolean;
};

const sizes = {
  lead: "lg:aspect-auto lg:h-(--card-h) lg:w-[calc(var(--card-h)/2)]",
  flank:
    "lg:mt-[calc(var(--card-h)*0.06)] lg:aspect-auto lg:h-[calc(var(--card-h)*0.88)] lg:w-[calc(var(--card-h)*0.44)]",
  grid: "lg:aspect-[4/5]",
} as const;

export function ProjectCard({ project, rank, layout, wide = false }: ProjectCardProps) {
  const lead = layout === "lead";
  const titleId = `${project.slug}-card-title`;
  const summaryId = `${project.slug}-card-summary`;

  return (
    <Link
      href={`/projects/${project.slug}`}
      prefetch
      aria-labelledby={titleId}
      aria-describedby={summaryId}
      className={`group relative block [container-type:size] aspect-[4/5] w-full outline-offset-4 transition-transform duration-(--dur-base) ease-(--ease-out) hover:translate-y-(--move-lift) focus-visible:translate-y-(--move-lift) ${
        wide ? "sm:aspect-[8/5]" : ""
      } ${sizes[layout]}`}
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
          lead ? "bg-text/75" : "bg-line-strong"
        }`}
      />

      <div className="clip-pennant absolute inset-px flex flex-col overflow-hidden bg-surface-solid">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-teal-soft to-transparent opacity-0 transition-opacity duration-(--dur-fast) group-hover:opacity-100 group-focus-visible:opacity-100"
        />

        <ProjectArt project={project} />
        <span
          aria-hidden="true"
          className={`relative shrink-0 transition-colors duration-(--dur-fast) ${
            lead ? "h-[3px] bg-teal" : "h-px bg-line-strong group-hover:bg-teal group-focus-visible:bg-teal"
          }`}
        />

        <div className="relative flex flex-1 flex-col gap-1.5 px-4 pt-3">
          {project.context && <span className="label text-gold">{project.context}</span>}
          <h3
            id={titleId}
            className="font-display text-xl leading-none font-bold uppercase @min-[210px]:text-2xl @min-[300px]:text-3xl"
          >
            {project.title}
          </h3>
          <p id={summaryId} className="text-xs leading-snug text-text-muted @min-[210px]:text-sm">
            {project.summary}
          </p>
          {/* Only cards with room to keep the cue clear of a three-line summary show it. */}
          <span
            aria-hidden="true"
            data-card-cue
            className="label mt-auto mb-11 hidden text-text-muted transition-colors duration-(--dur-fast) group-hover:text-teal group-focus-visible:text-teal [@container(min-width:240px)_and_(min-height:440px)]:block"
          >
            View project
          </span>
        </div>

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
      </div>
    </Link>
  );
}

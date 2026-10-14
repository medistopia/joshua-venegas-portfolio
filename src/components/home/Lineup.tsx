import type { CSSProperties } from "react";
import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { featured } from "@/content/projects";

/** Desktop seats: Recolm left, Hermes center (lead), Valorant ML right (docs/design.md, Section 3.5). */
const seats: Record<string, { order: string; lead: boolean }> = {
  recolm: { order: "lg:order-1", lead: false },
  "project-hermes": { order: "lg:order-2", lead: true },
  "valorant-ml": { order: "lg:order-3", lead: false },
};

/**
 * Document order is the featured order (Hermes first). From 640px the cards form two columns with the
 * third spanning both; from 1024px desktop CSS order seats Hermes in the center of the lineup.
 * The section is a size container so --card-h can never outgrow its column.
 */
export function Lineup() {
  return (
    <section
      aria-labelledby="featured-heading"
      className="relative flex flex-col items-center gap-6 lg:gap-7 lg:[container-type:inline-size]"
    >
      <h2 id="featured-heading" className="label self-start text-text-muted lg:sr-only">
        Featured work
      </h2>

      <div className="relative w-full lg:w-auto">
        <Monogram
          variant="emblem"
          gradientId="jv-emblem-desktop"
          className="absolute top-[calc(var(--card-h)*-0.26)] left-1/2 hidden h-(--card-h) -translate-x-1/2 opacity-20 lg:block"
        />
        <ol className="relative flex flex-col gap-8 sm:grid sm:grid-cols-2 sm:gap-6 lg:flex lg:flex-row lg:items-start lg:gap-3">
          {featured.map((project, i) => {
            const wide = i === featured.length - 1;
            const seat = seats[project.slug];
            return (
              <li
                key={project.slug}
                style={{ "--rise-delay": `${160 + i * 80}ms` } as CSSProperties}
                className={`animate-rise ${wide ? "sm:col-span-2" : ""} ${seat.order}`}
              >
                <ProjectCard
                  project={project}
                  rank={i + 1}
                  layout={seat.lead ? "lead" : "flank"}
                  wide={wide}
                />
              </li>
            );
          })}
        </ol>
      </div>

      <Link
        href="/projects"
        className="group relative mt-2 inline-flex px-10 py-3 font-display text-xl font-bold tracking-wide text-bg-deep uppercase lg:mt-4"
      >
        <span
          aria-hidden="true"
          className="clip-notch absolute inset-0 bg-coral transition-[filter] duration-(--dur-fast) group-hover:brightness-110"
        />
        <span className="relative">Explore projects</span>
      </Link>
    </section>
  );
}

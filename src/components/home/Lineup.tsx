import type { CSSProperties } from "react";
import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { featured, type Project } from "@/content/projects";

const desktopOrder: Record<Project["lineupPosition"], string> = {
  left: "lg:order-1",
  center: "lg:order-2",
  right: "lg:order-3",
};

/** Document order is the featured order (Hermes first); desktop CSS order seats Hermes in the center. */
export function Lineup() {
  return (
    <section aria-labelledby="featured-heading" className="relative flex flex-col items-center gap-6 lg:gap-7">
      <h2 id="featured-heading" className="label self-start text-text-muted lg:sr-only">
        Featured work
      </h2>

      <div className="relative w-full lg:w-auto">
        <Monogram
          variant="emblem"
          gradientId="jv-emblem-desktop"
          className="absolute top-[calc(var(--card-h)*-0.26)] left-1/2 hidden h-(--card-h) -translate-x-1/2 opacity-20 lg:block"
        />
        <ol className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-3">
          {featured.map((project, i) => (
            <li
              key={project.slug}
              style={{ "--rise-delay": `${160 + i * 80}ms` } as CSSProperties}
              className={`animate-rise ${desktopOrder[project.lineupPosition]}`}
            >
              <ProjectCard project={project} rank={i + 1} layout={project.lineupPosition === "center" ? "lead" : "flank"} />
            </li>
          ))}
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

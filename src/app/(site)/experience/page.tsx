import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons/Icons";
import { ExperienceRows } from "@/components/ui/ExperienceRows";
import { InProgressNote, Panel, SectionLabel, ViewFrame } from "@/components/views/ViewFrame";
import { featured } from "@/content/projects";
import { research } from "@/content/research";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  const researchProjects = featured.filter((project) => project.kind === "research");

  return (
    <ViewFrame kicker="Experience" title="Experience">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section aria-labelledby="roles-heading" className="flex flex-col gap-3">
          <SectionLabel id="roles-heading">Roles</SectionLabel>
          <ExperienceRows />
        </section>

        <section aria-labelledby="research-heading" className="flex flex-col gap-3">
          <SectionLabel id="research-heading">Research</SectionLabel>
          {research.map((item) => (
            <Panel key={item.id} className="flex flex-col gap-3 px-4 py-4">
              <p className="font-display text-2xl leading-tight font-semibold uppercase">{item.title}</p>
              {item.projectTitle && <p className="text-sm">{item.projectTitle}</p>}
              <InProgressNote>Details in progress</InProgressNote>
            </Panel>
          ))}
          {researchProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex items-center justify-between gap-4 border border-line bg-surface px-4 py-4 transition-colors duration-(--dur-fast) hover:border-teal"
            >
              <span className="flex flex-col gap-1">
                {project.context && <span className="label text-gold">{project.context}</span>}
                <span className="font-display text-2xl leading-tight font-semibold uppercase">{project.title}</span>
                <span className="text-sm text-text-muted">{project.summary}</span>
              </span>
              <ArrowIcon className="size-5 shrink-0 text-text-muted transition-colors duration-(--dur-fast) group-hover:text-teal" />
            </Link>
          ))}
        </section>
      </div>
    </ViewFrame>
  );
}

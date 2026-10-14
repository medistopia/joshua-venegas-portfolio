import type { Metadata } from "next";
import { InProgressNote, PageBody, PageHeader } from "@/components/ui/PageHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { featured } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <PageBody>
      <PageHeader eyebrow="Projects" title="Featured work">
        Three projects across product software, agent tooling, and applied machine learning research.
      </PageHeader>
      <InProgressNote>Case studies in progress</InProgressNote>
      <section aria-labelledby="featured-projects-heading">
        <h2 id="featured-projects-heading" className="sr-only">
          Featured projects
        </h2>
        <ol className="grid gap-10 pt-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {featured.map((project, i) => {
            const wide = i === featured.length - 1;
            return (
              <li key={project.slug} className={wide ? "sm:col-span-2 lg:col-span-1" : undefined}>
                <ProjectCard project={project} rank={i + 1} layout="grid" wide={wide} />
              </li>
            );
          })}
        </ol>
      </section>
    </PageBody>
  );
}

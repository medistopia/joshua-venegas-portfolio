import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InProgressNote, PageBody } from "@/components/ui/PageHeader";
import { ProjectArt } from "@/components/ui/ProjectArt";
import { featured, findProject } from "@/content/projects";

const caseStudySections = ["Problem", "My role", "Implementation decisions", "Evidence", "Outcomes"];

export function generateStaticParams() {
  return featured.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = findProject(slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default function ProjectPage(props: PageProps<"/projects/[slug]">) {
  return (
    <PageBody>
      <Link
        href="/projects"
        className="label self-start text-text-muted transition-colors duration-(--dur-fast) hover:text-text"
      >
        All projects
      </Link>
      <Suspense fallback={<div className="h-64" />}>
        <ProjectDetail params={props.params} />
      </Suspense>
    </PageBody>
  );
}

async function ProjectDetail({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  return (
    <article className="flex flex-col gap-10">
      <header className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <div className="flex flex-col gap-4">
          {project.context && <p className="label text-gold">{project.context}</p>}
          <h1 className="font-display text-display-l font-bold uppercase">{project.title}</h1>
          <p className="max-w-[48ch] text-lg leading-relaxed text-text-muted">{project.summary}</p>
        </div>
        <div className="relative aspect-video border border-line-strong">
          <ProjectArt project={project} className="h-full" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </header>

      <InProgressNote>Case study in progress</InProgressNote>

      <section aria-labelledby="case-study-outline">
        <h2 id="case-study-outline" className="label text-text-muted">
          Planned sections
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {caseStudySections.map((section) => (
            <li key={section} className="grid grid-cols-[3px_1fr] border border-line bg-surface-solid">
              <span aria-hidden="true" className="bg-line-strong" />
              <div className="flex flex-col gap-1 px-4 py-3">
                <p className="font-display text-xl font-semibold uppercase">{section}</p>
                <p className="text-sm text-text-muted">Not yet published</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

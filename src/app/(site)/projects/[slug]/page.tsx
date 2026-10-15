import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, ChevronIcon } from "@/components/icons/Icons";
import { artFor, formatDate, labelFor } from "@/components/lobby/config";
import { InProgressNote, SectionLabel } from "@/components/views/ViewFrame";
import { WorkflowDiagram } from "@/components/views/WorkflowDiagram";
import { findPerson } from "@/content/people";
import { allProjects, findProject, type Project } from "@/content/projects";
import { hermesCaseStudy, type CaseStudy } from "@/content/hermes-case-study";

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = findProject(slug);
  return project ? { title: project.title, description: project.summary } : {};
}

/**
 * Case study view. From 1024px the project list and the reading panel each scroll on their own,
 * so the shell's navigation stays in view; below 1024px the page scrolls.
 */
export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = findProject(slug);
  if (!project) notFound();

  return (
    <div
      data-view="inner"
      className="mx-auto grid w-full max-w-[1320px] gap-6 px-4 py-8 sm:px-8 lg:h-full lg:grid-cols-[240px_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:py-6"
    >
      <Reader project={project} />
      <ProjectList current={project.slug} />
    </div>
  );
}

function Reader({ project }: { project: Project }) {
  const art = artFor(project.slug);
  const label = labelFor(project);
  const people = project.people.map(findPerson).filter((person) => person !== undefined);
  const isExperiment = project.kind === "experiment";
  const caseStudy = project.slug === "project-hermes" ? hermesCaseStudy : null;

  return (
    <article
      aria-labelledby="project-title"
      tabIndex={0}
      className="flex flex-col border border-line bg-surface backdrop-blur-sm lg:col-start-2 lg:row-start-1 lg:min-h-0 lg:overflow-y-auto"
    >
      <header className="relative flex min-h-56 flex-col justify-end gap-2 overflow-hidden border-b border-line p-6 sm:p-8">
        <Image src={art.src} alt="" fill sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" style={{ objectPosition: art.focus }} />
        <span aria-hidden="true" className="scrim-feature absolute inset-0" />
        <span aria-hidden="true" className="scrim-tile absolute inset-0" />
        <p className="label label-plate absolute top-4 right-4 text-text-muted">Illustrative art</p>
        {label && <p className="label label-plate relative self-start text-gold">{label}</p>}
        <h1 id="project-title" className="relative font-display text-display-m font-bold uppercase">
          {project.title}
        </h1>
      </header>

      <div className="flex flex-col gap-8 p-6 sm:p-8">
        <p className="max-w-[62ch] text-lg leading-relaxed">{project.description ?? project.summary}</p>

        {caseStudy && <Overview project={project} caseStudy={caseStudy} />}

        {caseStudy && (
          <section aria-labelledby="case-workflow" className="flex flex-col gap-4">
            <h2 id="case-workflow" className="font-display text-2xl font-semibold uppercase text-text">
              Reply workflow
            </h2>
            <WorkflowDiagram workflow={caseStudy.workflow} labelledBy="case-workflow" />
          </section>
        )}

        {!caseStudy && (project.status || project.milestones.length > 0 || people.length > 0) && (
          <dl className="grid gap-px border border-line bg-line sm:grid-cols-3">
            {project.status && (
              <div className="bg-surface-solid px-4 py-3">
                <dt className="label text-gold">Status</dt>
                <dd className="mt-1 text-sm">{project.status}</dd>
              </div>
            )}
            {project.milestones.map((milestone) => (
              <div key={milestone.label} className="bg-surface-solid px-4 py-3">
                <dt className="label text-gold">{milestone.label}</dt>
                <dd className="mt-1 text-sm">{formatDate(milestone.date)}</dd>
              </div>
            ))}
            {people.length > 0 && (
              <div className="bg-surface-solid px-4 py-3">
                <dt className="label text-gold">With</dt>
                {people.map((person) => (
                  <dd key={person.id} className="mt-1 text-sm">
                    {person.name}
                  </dd>
                ))}
              </div>
            )}
          </dl>
        )}

        {caseStudy?.sections.map((section) => (
          <section key={section.id} aria-labelledby={`case-${section.id}`} className="flex max-w-[65ch] flex-col gap-3">
            <h2 id={`case-${section.id}`} className="scroll-mt-6 font-display text-2xl font-semibold uppercase text-text">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-text">{paragraph}</p>
            ))}
          </section>
        ))}

        {!caseStudy && project.contributions.length > 0 && (
          <section aria-labelledby="contributions-heading" className="flex flex-col gap-3">
            <SectionLabel id="contributions-heading">What I worked on</SectionLabel>
            <ul className="grid gap-2 md:grid-cols-2">
              {project.contributions.map((item) => (
                <li key={item} className="grid grid-cols-[3px_1fr] border border-line bg-surface-solid">
                  <span aria-hidden="true" className="bg-teal" />
                  <span className="px-4 py-2.5 text-sm leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.components.length > 0 && (
          <section aria-labelledby="components-heading" className="flex flex-col gap-3">
            <SectionLabel id="components-heading">{isExperiment ? "What the experiment involves" : "What it involves"}</SectionLabel>
            <ul className="flex flex-wrap gap-2">
              {project.components.map((item) => (
                <li key={item} className="border border-line-strong px-3 py-1.5 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.stack.length > 0 && (
          <section aria-labelledby="stack-heading" className="flex flex-col gap-3">
            <SectionLabel id="stack-heading">Stack</SectionLabel>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item} className="label border border-line px-3 py-1.5 text-text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {caseStudy && <p className="max-w-[65ch] border-t border-line pt-4 text-sm leading-relaxed text-text-muted">{caseStudy.note}</p>}

        {!caseStudy && <InProgressNote>Full case study in progress</InProgressNote>}
      </div>
    </article>
  );
}

/** The case study's scannable summary; facts shared with other views come from the project record. */
function Overview({ project, caseStudy }: { project: Project; caseStudy: CaseStudy }) {
  const { overview } = caseStudy;
  const cells = [
    { term: "Problem", detail: overview.problem },
    { term: "My role", detail: overview.role },
    { term: "Delivered", detail: overview.delivered },
  ];

  return (
    <section aria-labelledby="case-overview" className="flex flex-col gap-4">
      <h2 id="case-overview" className="font-display text-2xl font-semibold uppercase text-text">
        Overview
      </h2>
      <dl className="grid gap-px border border-line bg-line md:grid-cols-2">
        {cells.map((cell) => (
          <div key={cell.term} className="bg-surface-solid px-4 py-3">
            <dt className="label text-gold">{cell.term}</dt>
            <dd className="mt-1 text-sm leading-relaxed">{cell.detail}</dd>
          </div>
        ))}
        <div className="bg-surface-solid px-4 py-3">
          <dt className="label text-gold">Status</dt>
          {project.status && <dd className="mt-1 text-sm leading-relaxed">{project.status}</dd>}
          {project.milestones.map((milestone) => (
            <dd key={milestone.label} className="mt-1 text-sm leading-relaxed">
              {milestone.label}: {formatDate(milestone.date)}
            </dd>
          ))}
        </div>
      </dl>

      <h3 id="overview-decisions" className="label text-text-muted">
        Key engineering decisions
      </h3>
      <ol aria-labelledby="overview-decisions" className="grid gap-3 md:grid-cols-3">
        {overview.decisions.map((decision, i) => (
          <li key={decision.section}>
            <a
              href={`#case-${decision.section}`}
              className="group flex h-full flex-col gap-1.5 border border-line bg-surface-solid p-3 transition-colors duration-(--dur-fast) hover:border-teal"
            >
              <span className="label text-text-muted">Decision {i + 1}</span>
              <span className="inline-flex items-center gap-1.5 font-display text-xl leading-tight font-semibold uppercase text-teal">
                {decision.title}
                <ArrowIcon className="size-4 shrink-0" />
              </span>
              <span className="text-sm leading-snug text-text">{decision.summary}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ProjectList({ current }: { current: string }) {
  return (
    <nav aria-label="Projects" className="flex flex-col gap-3 lg:col-start-1 lg:row-start-1 lg:min-h-0 lg:overflow-y-auto">
      <Link
        href="/projects"
        className="label inline-flex items-center gap-1 self-start text-text-muted transition-colors duration-(--dur-fast) hover:text-text"
      >
        <ChevronIcon direction="left" className="size-4" />
        All projects
      </Link>
      <ul className="flex flex-col gap-2">
        {allProjects.map((project) => {
          const active = project.slug === current;
          const art = artFor(project.slug);
          const label = labelFor(project);
          return (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                aria-current={active ? "page" : undefined}
                className={`group grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3 border p-2 transition-colors duration-(--dur-fast) ${
                  active ? "border-teal bg-teal-soft" : "border-line bg-surface hover:border-line-strong"
                }`}
              >
                <span aria-hidden="true" className="relative block h-16 overflow-hidden bg-bg-deep">
                  <Image src={art.src} alt="" fill sizes="48px" className="object-cover" style={{ objectPosition: art.focus }} />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  {label && <span className="label text-gold">{label}</span>}
                  <span className="font-display text-lg leading-tight font-semibold uppercase">{project.title}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

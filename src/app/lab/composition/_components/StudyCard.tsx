import type { Project } from "@/content/projects";

type StudyCardProps = {
  project: Project;
  index: number;
  lead: boolean;
};

export function StudyCard({ project, index, lead }: StudyCardProps) {
  const size = lead
    ? "lg:h-(--card-h) lg:w-[calc(var(--card-h)/2)]"
    : "lg:mt-[calc(var(--card-h)*0.06)] lg:h-[calc(var(--card-h)*0.88)] lg:w-[calc(var(--card-h)*0.44)]";

  return (
    <article className={`relative aspect-[4/5] w-full lg:aspect-auto ${size}`}>
      <span className="label absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 border border-gold bg-bg-deep px-2 py-0.5 text-gold">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className={`clip-pennant absolute inset-0 ${lead ? "bg-text/75" : "bg-line-strong"}`} />
      <div className="clip-pennant absolute inset-px flex flex-col bg-surface-solid/95">
        <ArtPlaceholder need={project.art.need} />
        <div className={lead ? "h-[3px] bg-teal" : "h-px bg-line-strong"} />
        <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3">
          {project.context && <span className="label text-gold">{project.context}</span>}
          <h2 className="font-display text-2xl leading-none font-bold uppercase short:text-xl">{project.title}</h2>
          <p className="text-sm leading-snug text-text-muted short:text-xs">{project.summary}</p>
        </div>
        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-[42px] w-full ${lead ? "text-gold" : "text-line-strong"}`}
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
    </article>
  );
}

function ArtPlaceholder({ need }: { need: Project["art"]["need"] }) {
  return (
    <div className="relative h-[56%] overflow-hidden bg-[repeating-linear-gradient(135deg,rgb(237_234_227/0.06)_0_1px,transparent_1px_11px)]">
      {need === "research-chart" && (
        <div aria-hidden="true" className="absolute top-8 right-5 bottom-7 left-6 border-b border-l border-line-strong" />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center">
        <span className="label text-text-muted">Composition placeholder</span>
        <span className="text-xs text-text-muted/80">
          {need === "research-chart" ? "Original research chart needed. No data shown." : "Real product capture needed."}
        </span>
      </div>
    </div>
  );
}

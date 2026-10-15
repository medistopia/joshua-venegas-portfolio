import type { CSSProperties } from "react";
import { ChevronIcon } from "@/components/icons/Icons";
import type { CaseStudy, WorkflowSystem } from "@/content/hermes-case-study";

const systemStyle: Record<WorkflowSystem, { tag: string; bar: string; name: string }> = {
  hermes: { tag: "border-teal", bar: "bg-teal", name: "text-teal" },
  gmail: { tag: "border-gold", bar: "bg-gold", name: "text-gold" },
  supabase: { tag: "border-dashed border-text-muted", bar: "bg-text-muted", name: "text-text" },
};

function ReviewText({ review, returnStep }: { review: CaseStudy["workflow"]["review"]; returnStep: number }) {
  return (
    <>
      <p className="label text-coral">{review.title}</p>
      <p className="text-sm leading-snug text-text">
        {review.detail} Back to step {returnStep}.
      </p>
    </>
  );
}

const COLUMNS = 3;

/**
 * Numbered steps tagged with the system that holds them: one column below 768px, three from 768px.
 * The review path is read as part of the step it leaves. When both ends sit in the last row of three,
 * from 768px it is drawn instead as a dashed loop hanging between the centers of those steps.
 */
export function WorkflowDiagram({ workflow, labelledBy }: { workflow: CaseStudy["workflow"]; labelledBy: string }) {
  const { systems, steps, review, description } = workflow;
  const nameOf = (id: WorkflowSystem) => systems.find((system) => system.id === id)!.name;
  const from = steps.findIndex((step) => step.id === review.from);
  const to = steps.findIndex((step) => step.id === review.to);
  const lastRow = Math.floor((steps.length - 1) / COLUMNS) * COLUMNS;
  const loop = to >= lastRow ? ({ "--loop-start": to % COLUMNS, "--loop-span": from - to } as CSSProperties) : null;

  return (
    <figure
      aria-labelledby={labelledBy}
      className="flex flex-col gap-5 [--flow-col:calc((100%_-_2_*_var(--flow-gap))_/_3)] [--flow-gap:1.5rem]"
    >
      <ol className="grid gap-(--flow-gap) md:grid-cols-3">
        {steps.map((step, i) => {
          const style = systemStyle[step.system];
          const last = i === steps.length - 1;
          const rowEnd = (i + 1) % COLUMNS === 0;
          return (
            <li key={step.id} data-step={step.id} className="relative grid grid-cols-[3px_minmax(0,1fr)] border border-line bg-surface-solid">
              <span aria-hidden="true" className={style.bar} />
              <div className="flex flex-col gap-1.5 p-3">
                <p className="flex items-center justify-between gap-2">
                  <span className="label text-text-muted">Step {i + 1}</span>
                  <span className={`label border px-1.5 py-0.5 ${style.tag} ${style.name}`}>{nameOf(step.system)}</span>
                </p>
                <p className="font-display text-xl leading-tight font-semibold uppercase">{step.title}</p>
                <p className="text-sm leading-snug text-text-muted">{step.detail}</p>
              </div>

              {i === from && (
                <div
                  data-review-path
                  className={`col-span-2 flex flex-col gap-1 border-t border-dashed border-coral px-3 py-2.5 ${loop ? "md:sr-only" : ""}`}
                >
                  <ReviewText review={review} returnStep={to + 1} />
                </div>
              )}

              {!last && (
                <span aria-hidden="true" className={`absolute top-full left-1/2 grid h-(--flow-gap) -translate-x-1/2 place-items-center text-text-muted md:hidden`}>
                  <ChevronIcon direction="right" className="size-4 rotate-90" />
                </span>
              )}
              {!last && !rowEnd && (
                <span aria-hidden="true" className="absolute top-1/2 left-full hidden w-(--flow-gap) -translate-y-1/2 place-items-center text-text-muted md:grid">
                  <ChevronIcon direction="right" className="size-4" />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {loop && (
        <div
          aria-hidden="true"
          style={loop}
          className="relative -mt-5 ml-[calc(var(--flow-col)_*_(var(--loop-start)_+_0.5)_+_var(--flow-gap)_*_var(--loop-start))] hidden w-[calc((var(--flow-col)_+_var(--flow-gap))_*_var(--loop-span))] flex-col gap-1 border border-t-0 border-dashed border-coral px-4 pt-4 pb-3 md:flex"
        >
          <svg viewBox="0 0 10 8" className="absolute top-0 -left-[5.5px] h-2 w-2.5 fill-coral">
            <path d="M5 0 10 8H0Z" />
          </svg>
          <ReviewText review={review} returnStep={to + 1} />
        </div>
      )}

      <dl className="grid gap-px border border-line bg-line sm:grid-cols-3">
        {systems.map((system) => (
          <div key={system.id} className="grid grid-cols-[3px_minmax(0,1fr)] bg-surface-solid">
            <span aria-hidden="true" className={systemStyle[system.id].bar} />
            <div className="px-4 py-3">
              <dt className={`label ${systemStyle[system.id].name}`}>{system.name}</dt>
              <dd className="mt-1 text-sm leading-snug">{system.role}</dd>
            </div>
          </div>
        ))}
      </dl>

      <figcaption className="flex flex-col gap-1">
        <span className="label text-text-muted">Text description</span>
        <span className="text-sm leading-relaxed text-text">{description}</span>
      </figcaption>
    </figure>
  );
}

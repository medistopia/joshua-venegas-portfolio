import type { ReactNode } from "react";

type ViewFrameProps = {
  kicker: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

/** A view inside the shell: replaces the lobby's stage and reads over the dimmed hall. */
export function ViewFrame({ kicker, title, intro, children }: ViewFrameProps) {
  return (
    <div data-view="inner" className="mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-4 py-8 sm:px-8 lg:py-7">
      <header className="flex flex-col gap-2">
        <p className="label text-gold">{kicker}</p>
        <h1 className="font-display text-display-m font-bold uppercase">{title}</h1>
        {intro && <p className="max-w-[60ch] text-text-muted">{intro}</p>}
      </header>
      {children}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-line bg-surface backdrop-blur-sm ${className}`}>{children}</div>;
}

/** Marks content whose full version has not been published yet. */
export function InProgressNote({ children }: { children: ReactNode }) {
  return (
    <p className="label inline-flex items-center gap-3 self-start border border-line-strong px-4 py-3 text-text-muted">
      <span aria-hidden="true" className="size-2 bg-gold" />
      {children}
    </p>
  );
}

export function SectionLabel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="label text-text-muted">
      {children}
    </h2>
  );
}

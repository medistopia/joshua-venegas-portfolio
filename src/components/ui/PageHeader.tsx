import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, children }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-10">
      <p className="label text-gold">{eyebrow}</p>
      <h1 className="font-display text-display-l font-bold uppercase">{title}</h1>
      {children && <div className="max-w-[60ch] text-lg leading-relaxed text-text-muted">{children}</div>}
    </header>
  );
}

/** Marks a page whose full content has not been published yet. */
export function InProgressNote({ children }: { children: ReactNode }) {
  return (
    <p className="label inline-flex items-center gap-3 self-start border border-line-strong px-4 py-3 text-text-muted">
      <span aria-hidden="true" className="size-2 bg-gold" />
      {children}
    </p>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-14 lg:px-10 lg:py-20">{children}</div>;
}

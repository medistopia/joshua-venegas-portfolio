import type { ReactNode } from "react";

/** Study-only annotation drawn around a region. Never ships on real pages. */
export function GuideBox({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-3 border border-dashed border-guide">
        <span className="label absolute -top-3 left-2 bg-bg-deep px-1.5 py-0.5 text-[0.625rem] text-guide">{label}</span>
      </div>
      {children}
    </div>
  );
}

export function FocalMarker({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 ${className}`}>
      <div className="absolute bottom-1/2 left-1/2 h-[100svh] border-l border-dashed border-guide/70" />
      <div className="relative size-14 rounded-full border border-guide">
        <div className="absolute top-1/2 left-0 w-full border-t border-guide" />
        <div className="absolute top-0 left-1/2 h-full border-l border-guide" />
      </div>
      <span className="label absolute top-1/2 left-full ml-3 -translate-y-1/2 bg-bg-deep px-1.5 py-0.5 text-[0.625rem] whitespace-nowrap text-guide">
        {label}
      </span>
    </div>
  );
}

export function GuideChip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`label pointer-events-none bg-bg-deep px-1.5 py-0.5 text-[0.625rem] whitespace-nowrap text-guide ${className}`}
    >
      {children}
    </span>
  );
}

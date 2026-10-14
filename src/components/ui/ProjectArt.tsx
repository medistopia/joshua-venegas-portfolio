import Image from "next/image";
import type { Project } from "@/content/projects";

type ProjectArtProps = {
  project: Project;
  className?: string;
  sizes?: string;
};

const placeholderNote = {
  "product-capture": "Product capture pending",
  "research-chart": "Research chart pending. No data shown.",
} as const;

/**
 * The card's art area. Without a real capture or chart it shows a labelled placeholder:
 * an empty capture frame (or empty axes) lit like the backdrop, never an imitation interface.
 */
export function ProjectArt({ project, className = "h-[56%]", sizes = "(min-width: 1024px) 260px, 100vw" }: ProjectArtProps) {
  const { art } = project;
  const zoom =
    "absolute inset-0 transition-transform duration-(--dur-slow) ease-(--ease-out) group-hover:scale-(--move-zoom) group-focus-visible:scale-(--move-zoom)";

  if (art.src) {
    return (
      <div className={`relative shrink-0 overflow-hidden ${className}`}>
        <div className={zoom}>
          <Image src={art.src} alt={art.alt ?? ""} fill sizes={sizes} className="object-cover" />
        </div>
      </div>
    );
  }

  const research = art.need === "research-chart";

  return (
    <div aria-hidden="true" className={`relative shrink-0 overflow-hidden bg-bg-deep ${className}`}>
      <div className={zoom}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_80%_at_50%_0%,color-mix(in_srgb,var(--color-gold)_30%,transparent),transparent_72%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,var(--color-line)_0_1px,transparent_1px_12px)] opacity-50" />

        <div className="absolute inset-x-[14%] top-[16%] bottom-[38%] border border-dashed border-line-strong">
          <Corner className="-top-px -left-px border-t border-l" />
          <Corner className="-top-px -right-px border-t border-r" />
          <Corner className="-bottom-px -left-px border-b border-l" />
          <Corner className="-right-px -bottom-px border-r border-b" />
          {research && (
            <div className="absolute top-[18%] right-[10%] bottom-[18%] left-[14%] border-b border-l border-text-muted/60 bg-[repeating-linear-gradient(90deg,transparent_0_calc(25%-1px),var(--color-line)_calc(25%-1px)_25%)]" />
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[6%] flex flex-col items-center gap-1 px-3 text-center">
        <span className="label text-text">Placeholder</span>
        <span className="text-xs leading-tight text-text-muted">{placeholderNote[art.need]}</span>
      </div>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return <span className={`absolute size-2.5 border-gold ${className}`} />;
}

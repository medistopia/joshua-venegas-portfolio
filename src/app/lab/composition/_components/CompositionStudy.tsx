import type { CSSProperties, ReactNode } from "react";
import { Monogram } from "@/components/brand/Monogram";
import { profile } from "@/content/profile";
import { lineup } from "@/content/projects";
import type { Candidate } from "../_lib/candidates";
import { Backdrop } from "./Backdrop";
import { FocalMarker, GuideBox, GuideChip } from "./Guide";
import { StudyCard } from "./StudyCard";
import { StudyTopBar } from "./StudyTopBar";

const railTiles = [
  { label: "Experience", lines: profile.roles },
  { label: "About", lines: ["UNG computer science", "Machine learning minor"] },
  { label: "Contact", lines: ["Links added once confirmed"] },
];

const cardHeight = { "--card-h": "clamp(360px, calc(100svh - 320px), 520px)" } as CSSProperties;

function Zone({ guides, label, children }: { guides: boolean; label: string; children: ReactNode }) {
  return guides ? <GuideBox label={label}>{children}</GuideBox> : <>{children}</>;
}

export function CompositionStudy({ candidate, guides }: { candidate: Candidate; guides: boolean }) {
  return (
    <div style={cardHeight} className="relative isolate min-h-svh overflow-x-clip lg:h-svh lg:overflow-hidden">
      <Backdrop candidate={candidate} />
      <StudyTopBar />

      <main className="relative mx-auto grid max-w-[1440px] gap-12 px-4 pb-16 lg:h-[calc(100svh-56px-40px)] lg:grid-cols-[minmax(300px,360px)_1fr_minmax(176px,200px)] lg:items-center lg:gap-6 lg:px-10 lg:pb-0 short:px-8">
        <section className="relative pt-[27svh] lg:pt-0">
          <Monogram variant="emblem" gradientId="jv-emblem-mobile" className="absolute top-[6svh] left-1/2 h-[15svh] -translate-x-1/2 opacity-20 lg:hidden" />
          {guides && <FocalMarker label="Key light" className="top-[13svh] left-1/2 lg:hidden" />}
          <Zone guides={guides} label="Text safe zone: dark, low detail">
            <div data-safe-zone>
              <p className="label text-gold">{profile.eyebrow}</p>
              <h1 className="mt-4 font-display text-display-xl font-bold uppercase short:mt-3 short:text-display-xl-short">
                <span className="block">{profile.name.first}</span>
                <span className="block">{profile.name.last}</span>
              </h1>
              <p className="mt-5 max-w-[28ch] text-lg leading-snug lg:text-xl short:mt-4 short:text-lg">
                {profile.headline}
              </p>
              <div className="mt-7 flex gap-3 short:mt-5">
                <span className="label border border-gold px-5 py-3 text-gold">Résumé</span>
                <span className="label border border-line-strong px-5 py-3">Contact</span>
              </div>
            </div>
          </Zone>
        </section>

        <section aria-label="Featured projects" className="relative flex flex-col items-center gap-6 lg:gap-7">
          <h2 className="label self-start text-text-muted lg:sr-only">Featured work</h2>
          <div className="relative flex w-full flex-col gap-8 lg:w-auto lg:flex-row lg:items-start lg:gap-3">
            <Monogram
              variant="emblem"
              gradientId="jv-emblem-desktop"
              className="absolute top-[calc(var(--card-h)*-0.26)] left-1/2 hidden h-(--card-h) -translate-x-1/2 opacity-20 lg:block"
            />
            {guides && <FocalMarker label="Key light: behind lead card" className="top-[-44px] left-1/2 hidden lg:block" />}
            {lineup.map((project, i) => (
              <StudyCard key={project.slug} project={project} index={i} lead={i === 1} />
            ))}
            {guides && (
              <GuideChip className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
                Lineup: cards 1:2, flanks 88% and set back
              </GuideChip>
            )}
          </div>
          <span className="clip-notch mt-2 bg-coral px-10 py-3 font-display text-xl font-bold tracking-wide text-bg-deep uppercase lg:mt-4">
            Explore projects
          </span>
        </section>

        <aside className="hidden lg:block">
          <Zone guides={guides} label="Panel zone">
            <div className="flex flex-col gap-3">
              {railTiles.map((tile) => (
                <div key={tile.label} className="clip-notch border-l-2 border-gold bg-surface px-4 py-3 backdrop-blur-md">
                  <p className="label text-gold">{tile.label}</p>
                  {tile.lines.map((line) => (
                    <p key={line} className="mt-1 text-sm leading-snug">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </Zone>
        </aside>
      </main>

      <footer className="absolute inset-x-0 bottom-0 hidden h-10 items-center gap-3 border-t border-line bg-bg-deep/80 px-10 backdrop-blur-md lg:flex short:px-8">
        <span className="label text-text-muted">Currently</span>
        <span className="text-sm">{profile.education}</span>
      </footer>

      {guides && (
        <div aria-hidden="true" className="absolute top-[68px] right-4 z-30 max-w-[300px] text-right">
          <GuideChip>
            Candidate {candidate.id.toUpperCase()}: {candidate.name}
          </GuideChip>
          <p className="mt-1 text-[0.625rem] leading-snug text-guide">{candidate.source}</p>
        </div>
      )}
    </div>
  );
}

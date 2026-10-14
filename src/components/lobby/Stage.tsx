import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";
import { pennants } from "./config";
import { Pennant } from "./Pennant";

/** Center stage: the lineup in featured order, seated Recolm, Hermes, Valorant ML, with the primary action below. */
export function Stage() {
  return (
    <section
      aria-labelledby="lineup-heading"
      className="flex flex-col items-center justify-center gap-7 [container-type:inline-size]"
    >
      <h2 id="lineup-heading" className="sr-only">
        Featured projects
      </h2>
      <div className="relative">
        <Monogram
          variant="emblem"
          gradientId="jv-emblem-lobby"
          className="absolute top-[calc(var(--pennant-h)*-0.22)] left-1/2 h-(--pennant-h) -translate-x-1/2 opacity-20"
        />
        <ol className="relative flex items-start">
          {pennants.map((item) => (
            <Pennant key={item.project.slug} item={item} />
          ))}
        </ol>
      </div>
      <Link
        href="/projects"
        className="group relative inline-flex px-10 py-3 font-display text-xl font-bold tracking-wide text-bg-deep uppercase"
      >
        <span
          aria-hidden="true"
          className="clip-notch absolute inset-0 bg-coral transition-[filter] duration-(--dur-fast) group-hover:brightness-110"
        />
        <span className="relative">Explore projects</span>
      </Link>
    </section>
  );
}

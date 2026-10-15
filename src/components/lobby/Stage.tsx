import Link from "next/link";
import type { CSSProperties } from "react";
import { Monogram } from "@/components/brand/Monogram";
import { pennants } from "./config";
import { Pennant } from "./Pennant";

const seatClasses = {
  left: "sm:order-1 sm:-mr-4",
  center: "sm:order-2 sm:z-10",
  right: "sm:order-3 sm:-ml-4",
} as const;

/**
 * Center stage. The list is in featured order (Hermes first), which is the order on phones and for
 * keyboard and screen reader users; from 640px CSS order seats it Recolm, Hermes, Valorant ML.
 */
export function Stage() {
  return (
    <section
      aria-labelledby="lineup-heading"
      className="flex flex-col items-center justify-center gap-7 lg:self-center"
    >
      <h2 id="lineup-heading" className="label self-start text-text-muted sm:sr-only">
        Featured projects
      </h2>
      <div className="relative w-full sm:w-auto">
        <Monogram
          variant="emblem"
          gradientId="jv-emblem-lobby"
          className="absolute top-[calc(var(--pennant-h)*-0.22)] left-1/2 hidden h-(--pennant-h) -translate-x-1/2 opacity-20 sm:block"
        />
        <ol className="relative flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-0">
          {pennants.map((item, i) => (
            <li
              key={item.project.slug}
              style={{ "--entrance-order": i } as CSSProperties}
              className={`lobby-pennant animate-rise relative ${item.seat ? seatClasses[item.seat] : ""}`}
            >
              <Pennant item={item} variant={item.seat === "center" ? "lead" : "flank"} />
            </li>
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

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { featureTiles } from "./config";

/**
 * Promotional tiles. From 1280px they form the right column, sized to the lead pennant with the
 * first one taller; from 640px to 1279px they sit in a row; below 640px they stack.
 */
export function FeatureTiles() {
  return (
    <nav
      aria-label="Highlights"
      className="grid gap-3 sm:grid-cols-3 lg:col-span-2 xl:col-span-1 xl:mb-19 xl:flex xl:h-(--pennant-h) xl:flex-col xl:self-center"
    >
      {featureTiles.map((tile, i) => (
        <Link
          key={tile.id}
          href={tile.href}
          style={{ "--entrance-order": i } as CSSProperties}
          className={`lobby-highlight animate-rise group relative block h-36 min-h-0 lg:h-24 xl:h-auto ${i === 0 ? "xl:flex-[1.7]" : "xl:flex-1"}`}
        >
          <span
            aria-hidden="true"
            className="clip-notch absolute inset-0 bg-line-strong transition-colors duration-(--dur-fast) group-hover:bg-teal group-focus-visible:bg-teal"
          />
          <span aria-hidden="true" className="clip-notch absolute inset-px overflow-hidden bg-bg-deep">
            <Image
              src={tile.art.src}
              alt=""
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1279px) 33vw, 210px"
              className="object-cover transition-transform duration-(--dur-slow) ease-(--ease-out) group-hover:scale-(--move-zoom) group-focus-visible:scale-(--move-zoom)"
              style={{ objectPosition: tile.art.focus }}
            />
            <span className="scrim-tile absolute inset-0" />
          </span>
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3.5">
            <span className="label label-plate self-start text-gold">{tile.kicker}</span>
            <span className={`font-display leading-none font-bold uppercase ${i === 0 ? "xl:text-2xl" : ""} text-xl`}>
              {tile.title}
            </span>
            {tile.meta && <span className="text-xs text-text-muted">{tile.meta}</span>}
          </span>
        </Link>
      ))}
    </nav>
  );
}

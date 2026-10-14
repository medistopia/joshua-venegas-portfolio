import Image from "next/image";
import Link from "next/link";
import { featureTiles } from "./config";

/** Right feature column: promotional tiles, the first one tall. Sized to the lead pennant. */
export function FeatureTiles() {
  return (
    <nav aria-label="Highlights" className="mb-19 flex h-(--pennant-h) flex-col gap-3 self-center">
      {featureTiles.map((tile, i) => (
        <Link
          key={tile.id}
          href={tile.href}
          className={`group relative block min-h-0 ${i === 0 ? "flex-[1.7]" : "flex-1"}`}
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
              sizes="210px"
              className="object-cover transition-transform duration-(--dur-slow) ease-(--ease-out) group-hover:scale-(--move-zoom) group-focus-visible:scale-(--move-zoom)"
              style={{ objectPosition: tile.art.focus }}
            />
            <span className="scrim-tile absolute inset-0" />
          </span>
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3.5">
            <span className="label label-plate self-start text-gold">{tile.kicker}</span>
            <span className={`font-display leading-none font-bold uppercase ${i === 0 ? "text-2xl" : "text-xl"}`}>
              {tile.title}
            </span>
            {tile.meta && <span className="text-xs text-text-muted">{tile.meta}</span>}
          </span>
        </Link>
      ))}
    </nav>
  );
}

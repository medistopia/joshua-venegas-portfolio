"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowIcon, ChevronIcon } from "@/components/icons/Icons";
import type { WorkloadItem } from "./config";

/**
 * Image-led "Currently working on" carousel with manual controls only. The panel bleeds to the
 * top-left corner and its right edge is cut on the diagonal, traced by a gold rule.
 */
export function CurrentWork({ items }: { items: WorkloadItem[] }) {
  const [index, setIndex] = useState(0);
  const go = (next: number) => setIndex((next + items.length) % items.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby="current-work-heading"
      className="relative -mx-4 h-[248px] lg:h-[208px] xl:h-[248px] max-lg:overflow-x-clip sm:-mx-8 lg:mr-0 lg:-mt-4 xl:-mt-6"
    >
      <div aria-hidden="true" className="clip-diagonal absolute inset-0 bg-bg-deep" />
      {/* Not a heading: the name below is the page's h1 and comes first in the outline. */}
      <p id="current-work-heading" className="label label-plate absolute top-5 left-[10px] z-10 text-gold sm:left-[26px]">
        Currently working on
      </p>
      <div id="current-work-slides" aria-live="polite" className="absolute inset-0">
        {items.map((item, i) => {
          const active = i === index;
          return (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              inert={!active}
              className={`absolute inset-0 transition-opacity duration-(--dur-base) ${active ? "opacity-100" : "opacity-0"}`}
            >
              <div aria-hidden="true" className="clip-diagonal absolute inset-0">
                <Image
                  src={item.art.src}
                  alt=""
                  fill
                  sizes="340px"
                  className="object-cover"
                  style={{ objectPosition: item.art.focus }}
                />
                <div className="scrim-feature absolute inset-0" />
              </div>
              <div className="relative flex h-full flex-col justify-end gap-1.5 pt-5 pr-20 pb-[52px] pl-4 sm:pl-8">
                <h3 className="font-display text-3xl leading-none font-bold uppercase">{item.title}</h3>
                <p className="text-sm leading-snug text-text">{item.description}</p>
                {item.link && (
                  <Link
                    href={item.link.href}
                    className="label mt-1 inline-flex items-center gap-1.5 self-start text-teal underline-offset-4 hover:underline"
                  >
                    {item.link.label}
                    <ArrowIcon className="size-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-4 flex sm:left-8 items-center gap-2">
        <button
          type="button"
          aria-controls="current-work-slides"
          aria-label="Previous item"
          onClick={() => go(index - 1)}
          className="grid size-7 place-items-center border border-line-strong bg-bg-deep/60 text-text transition-colors duration-(--dur-fast) hover:border-teal hover:text-teal"
        >
          <ChevronIcon direction="left" className="size-4" />
        </button>
        <ul className="flex items-center">
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                aria-controls="current-work-slides"
                aria-label={`Show ${item.title}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className="group grid size-6 place-items-center"
              >
                <span
                  aria-hidden="true"
                  className={`size-2 rotate-45 transition-colors duration-(--dur-fast) ${
                    i === index ? "bg-gold" : "border border-text-muted group-hover:border-text"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-controls="current-work-slides"
          aria-label="Next item"
          onClick={() => go(index + 1)}
          className="grid size-7 place-items-center border border-line-strong bg-bg-deep/60 text-text transition-colors duration-(--dur-fast) hover:border-teal hover:text-teal"
        >
          <ChevronIcon direction="right" className="size-4" />
        </button>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full overflow-visible text-gold"
      >
        <line x1="80.6" y1="108" x2="103" y2="-4" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <line x1="86.6" y1="108" x2="109" y2="-4" stroke="currentColor" strokeOpacity="0.35" strokeWidth="6" vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}

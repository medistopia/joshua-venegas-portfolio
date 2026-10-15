"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore, type FocusEvent } from "react";
import { ArrowIcon, ChevronIcon, PauseIcon, PlayIcon } from "@/components/icons/Icons";
import type { WorkloadItem } from "./config";

const ROTATION_MS = 8000;

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Image-led "Currently working on" carousel. The panel bleeds to the top-left corner and its right
 * edge is cut on the diagonal, traced by a gold rule.
 *
 * It rotates every eight seconds unless reduced motion is requested, in which case it starts paused.
 * Rotation holds while the pointer is over it, while keyboard focus is inside it, and while the page
 * is hidden. Choosing a slide with the arrows or indicators stops rotation until the visitor presses
 * Play. Only visitor-initiated changes are announced.
 */
export function CurrentWork({ items }: { items: WorkloadItem[] }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<"playing" | "paused" | null>(null);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const pageHidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );

  const count = items.length;
  const playing = choice === null ? !reducedMotion : choice === "playing";
  const rotating = playing && !hovered && !keyboardFocus && !pageHidden && count > 1;

  useEffect(() => {
    if (!rotating) return;
    const timer = setTimeout(() => setIndex((current) => (current + 1) % count), ROTATION_MS);
    return () => clearTimeout(timer);
  }, [rotating, index, count]);

  const select = (next: number) => {
    const target = (next + count) % count;
    setIndex(target);
    setChoice("paused");
    setAnnouncement(`Slide ${target + 1} of ${count}: ${items[target].title}`);
  };

  const togglePlaying = () => {
    setChoice(playing ? "paused" : "playing");
    setAnnouncement("");
  };

  const onFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.target.matches(":focus-visible")) setKeyboardFocus(true);
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardFocus(false);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby="current-work-heading"
      data-rotating={rotating}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={onFocus}
      onBlur={onBlur}
      className="relative -mx-4 h-[248px] max-lg:overflow-x-clip sm:-mx-8 lg:mr-0 lg:-mt-4 xl:-mt-6"
    >
      <div aria-hidden="true" className="clip-diagonal absolute inset-0 bg-bg-deep" />
      {/* Not a heading: the name below is the page's h1 and comes first in the outline. */}
      <p id="current-work-heading" className="label label-plate absolute top-5 left-[10px] z-10 text-gold sm:left-[26px]">
        Currently working on
      </p>
      <div id="current-work-slides" className="absolute inset-0">
        {items.map((item, i) => {
          const active = i === index;
          return (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              data-slide={item.id}
              inert={!active}
              className={`absolute inset-0 transition-opacity duration-(--dur-base) ${active ? "opacity-100" : "opacity-0"}`}
            >
              <div aria-hidden="true" className="clip-diagonal absolute inset-0">
                <Image
                  src={item.art.src}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 100vw, 340px"
                  className="object-cover"
                  style={{ objectPosition: item.art.focus }}
                />
                <div className="scrim-feature absolute inset-0" />
              </div>
              <div className="relative flex h-full flex-col items-start justify-end pt-5 pr-20 pb-[52px] pl-4 sm:pl-8 lg:pr-16">
                <div className="scrim-text flex flex-col gap-1.5">
                  <h3 className="font-display text-3xl leading-none font-bold uppercase lg:max-xl:text-2xl">{item.title}</h3>
                  <p className="max-w-[56ch] text-sm leading-snug text-text">{item.description}</p>
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
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-2 sm:left-8">
        <button
          type="button"
          aria-controls="current-work-slides"
          aria-label="Previous item"
          onClick={() => select(index - 1)}
          className="grid size-7 place-items-center border border-line-strong bg-bg-deep/85 text-text transition-colors duration-(--dur-fast) hover:border-teal hover:text-teal"
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
                onClick={() => select(i)}
                className="group grid size-6 place-items-center"
              >
                <span
                  aria-hidden="true"
                  data-indicator
                  className={`size-2 rotate-45 border border-current transition-colors duration-(--dur-fast) ${
                    i === index ? "bg-current text-gold" : "text-text-muted group-hover:text-text"
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
          onClick={() => select(index + 1)}
          className="grid size-7 place-items-center border border-line-strong bg-bg-deep/85 text-text transition-colors duration-(--dur-fast) hover:border-teal hover:text-teal"
        >
          <ChevronIcon direction="right" className="size-4" />
        </button>
        <button
          type="button"
          aria-controls="current-work-slides"
          aria-label={playing ? "Pause automatic rotation" : "Play automatic rotation"}
          onClick={togglePlaying}
          className="label ml-1 flex h-7 items-center gap-1.5 border border-line-strong bg-bg-deep/85 pr-2.5 pl-2 text-text transition-colors duration-(--dur-fast) hover:border-teal hover:text-teal"
        >
          {playing ? <PauseIcon className="size-3.5" /> : <PlayIcon className="size-3.5" />}
          <span aria-hidden="true">{playing ? "Pause" : "Play"}</span>
        </button>
      </div>

      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>

      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full overflow-visible text-gold"
      >
        <line x1="81.4" y1="104" x2="103" y2="-4" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <line x1="87.4" y1="104" x2="109" y2="-4" stroke="currentColor" strokeOpacity="0.35" strokeWidth="6" vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}

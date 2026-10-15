"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { PauseIcon, PlayIcon } from "@/components/icons/Icons";

/* The visitor's choice outlives the lobby within a visit, so returning to it keeps the light paused. */
let pausedByVisitor = false;
const choiceListeners = new Set<() => void>();

function subscribeChoice(onChange: () => void) {
  choiceListeners.add(onChange);
  return () => {
    choiceListeners.delete(onChange);
  };
}

function setPausedByVisitor(paused: boolean) {
  pausedByVisitor = paused;
  for (const listener of choiceListeners) listener();
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

const subscribeNothing = () => () => {};

/**
 * Pause and Play for the lobby's ambient light (the `.ambient-light` layer in Backdrop). The button's
 * `data-ambient` state drives the animation from globals.css, so the light runs only while the
 * button is mounted: leaving the lobby unmounts it, removing the animation and its listeners. It
 * renders only after hydration, so the light never runs without a working control, and reduced
 * motion hides both in globals.css.
 */
export function AmbientControl() {
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false);
  return hydrated && pathname === "/" ? <AmbientToggle /> : null;
}

/** Pauses while the page is hidden without changing the visitor's choice. */
function AmbientToggle() {
  const paused = useSyncExternalStore(subscribeChoice, () => pausedByVisitor, () => false);
  const pageHidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false);

  return (
    <button
      type="button"
      data-ambient={paused || pageHidden ? "paused" : "playing"}
      onClick={() => setPausedByVisitor(!paused)}
      className="label hidden h-7 items-center gap-1.5 border border-line-strong bg-bg-deep/85 pr-2.5 pl-2 text-text transition-colors duration-(--dur-fast) hover:border-teal hover:text-teal lg:flex"
    >
      {paused ? <PlayIcon className="size-3.5" /> : <PauseIcon className="size-3.5" />}
      {paused ? "Play background motion" : "Pause background motion"}
    </button>
  );
}

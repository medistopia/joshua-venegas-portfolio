import type { CSSProperties } from "react";
import { getImageProps } from "next/image";
import type { Candidate } from "../_lib/candidates";

export function Backdrop({ candidate }: { candidate: Candidate }) {
  const common = { alt: "", sizes: "100vw" };
  const { desktop, mobile } = candidate;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktop.src, width: desktop.width, height: desktop.height });
  const {
    props: { srcSet: mobileSrcSet, ...img },
  } = getImageProps({ ...common, src: mobile.src, width: mobile.width, height: mobile.height });

  const positions = {
    "--art-position-desktop": desktop.position,
    "--art-position-mobile": mobile.position,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-svh overflow-hidden lg:inset-0 lg:h-auto"
    >
      <picture>
        <source media="(min-width: 1024px)" srcSet={desktopSrcSet} />
        <img
          {...img}
          alt=""
          srcSet={mobileSrcSet}
          fetchPriority="high"
          style={positions}
          className="absolute inset-0 size-full object-cover [object-position:var(--art-position-mobile)] lg:[object-position:var(--art-position-desktop)]"
        />
      </picture>

      {/* Scrims are identical for every candidate so only the art varies. */}
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(7_12_22/0.88)_0%,rgb(7_12_22/0.6)_20%,rgb(7_12_22/0)_38%)] lg:block" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(270deg,rgb(7_12_22/0.7)_0%,rgb(7_12_22/0)_20%)] lg:block" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(7_12_22/0.65)_0%,rgb(7_12_22/0)_14%)]" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(0deg,rgb(7_12_22/0.92)_0%,rgb(7_12_22/0)_26%)] lg:block" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(11_18_32/0)_24%,rgb(11_18_32/0.82)_42%,#0b1220_62%)] lg:hidden" />
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
    </div>
  );
}

import { getImageProps } from "next/image";
import { Monogram } from "@/components/brand/Monogram";

/** Candidate A (Atrium), interim resolution. Final art replaces these files at the same crops. */
const art = {
  desktop: { src: "/art/home/atrium-desktop.jpg", width: 1280, height: 720 },
  mobile: { src: "/art/home/atrium-mobile.jpg", width: 720, height: 1280 },
};

export function Backdrop() {
  const common = { alt: "", sizes: "100vw" };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, ...art.desktop });
  const {
    props: { srcSet: mobileSrcSet, ...img },
  } = getImageProps({ ...common, ...art.mobile });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden lg:inset-0 lg:h-auto"
    >
      <picture>
        <source media="(min-width: 1024px)" srcSet={desktopSrcSet} />
        <img
          {...img}
          alt=""
          srcSet={mobileSrcSet}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-[50%_10%] lg:object-[17%_50%]"
        />
      </picture>

      {/* Under the scrims, so text backing is unchanged; clipped clear of the blurred top bar and rail. */}
      <div className="absolute top-14 right-14 bottom-0 left-0 hidden overflow-hidden lg:block">
        <div className="ambient-light absolute -top-14 -right-14 bottom-0 left-0" />
      </div>

      <div className="scrim-left absolute inset-0 hidden lg:block" />
      <div className="scrim-right absolute inset-0 hidden lg:block" />
      <div className="scrim-top absolute inset-0 hidden lg:block" />
      <div className="scrim-bottom absolute inset-0 hidden lg:block" />
      <div className="scrim-mobile absolute inset-0 lg:hidden" />
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      {/* Views other than the lobby read over a dimmer hall. */}
      <div className="absolute inset-0 bg-bg-deep/70 opacity-0 [html:has([data-view=inner])_&]:opacity-100" />

      <Monogram
        variant="emblem"
        gradientId="jv-emblem-mobile"
        className="absolute top-[70px] left-1/2 h-[64px] -translate-x-1/2 opacity-25 lg:hidden"
      />
    </div>
  );
}

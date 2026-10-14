import { Backdrop } from "@/components/home/Backdrop";
import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { Lineup } from "@/components/home/Lineup";
import { PanelStack } from "@/components/home/PanelStack";
import { StatusStrip } from "@/components/home/StatusStrip";

export default function HomePage() {
  return (
    <>
      {/* The fold slides under the translucent top bar so the art runs to the top edge. It never clips: it grows and scrolls. */}
      <div className="relative isolate -mt-14 pt-14 lg:min-h-svh">
        <Backdrop />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 pb-16 sm:px-8 lg:mb-10 lg:min-h-[calc(100svh-96px)] lg:grid-cols-[300px_minmax(0,1fr)] lg:content-center lg:items-center lg:gap-x-6 lg:gap-y-8 lg:px-10 lg:py-8 xl:grid-cols-[minmax(300px,360px)_minmax(0,1fr)_minmax(176px,200px)] xl:py-0 short:px-8">
          <Hero />
          <Lineup />
          <PanelStack />
        </div>
        <StatusStrip />
      </div>
      <HomeSections />
    </>
  );
}

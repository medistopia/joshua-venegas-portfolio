import { Backdrop } from "@/components/home/Backdrop";
import { Hero } from "@/components/home/Hero";
import { HomeSections } from "@/components/home/HomeSections";
import { Lineup } from "@/components/home/Lineup";
import { PanelStack } from "@/components/home/PanelStack";
import { StatusStrip } from "@/components/home/StatusStrip";

export default function HomePage() {
  return (
    <>
      {/* The fold slides under the translucent top bar so the art runs to the top edge. */}
      <div className="relative isolate -mt-14 overflow-x-clip pt-14 lg:h-svh lg:min-h-[640px] lg:overflow-hidden">
        <Backdrop />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-4 pb-16 lg:h-[calc(100%-40px)] lg:grid-cols-[minmax(300px,360px)_1fr_minmax(176px,200px)] lg:items-center lg:gap-6 lg:px-10 lg:pb-0 short:px-8">
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

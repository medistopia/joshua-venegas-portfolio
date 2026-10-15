import { CurrentWork } from "@/components/lobby/CurrentWork";
import { workload } from "@/components/lobby/config";
import { FeatureTiles } from "@/components/lobby/FeatureTiles";
import { Identity } from "@/components/lobby/Identity";
import { Stage } from "@/components/lobby/Stage";
import { CollaboratorStrip } from "@/components/shell/Collaborators";

/**
 * The lobby. 1280px and up: feature and identity, stage, and tiles in three columns.
 * 1024 to 1279px: feature and identity beside the stage, tiles in a row beneath.
 * Below 1024px: one column in document order, with collaborators at the end.
 */
export default function HomePage() {
  return (
    <div className="lobby flex flex-col gap-10 px-4 pb-12 sm:px-8 lg:grid lg:min-h-full lg:grid-cols-[280px_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_auto] lg:gap-x-8 lg:gap-y-5 lg:py-4 xl:gap-y-6 xl:py-6 xl:grid-cols-[300px_minmax(0,1fr)_208px] xl:grid-rows-1">
      <div className="flex flex-col gap-7 lg:gap-5 xl:gap-7">
        <CurrentWork items={workload} />
        <Identity />
      </div>
      <Stage />
      <FeatureTiles />
      <CollaboratorStrip />
    </div>
  );
}

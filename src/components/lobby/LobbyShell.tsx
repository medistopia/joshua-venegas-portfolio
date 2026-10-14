import { Backdrop } from "@/components/home/Backdrop";
import { SkipLink } from "@/components/shell/SkipLink";
import { CollaboratorRail } from "./CollaboratorRail";
import { workload } from "./config";
import { CurrentWork } from "./CurrentWork";
import { FeatureTiles } from "./FeatureTiles";
import { Identity } from "./Identity";
import { LobbyTopBar } from "./LobbyTopBar";
import { Stage } from "./Stage";

/**
 * Desktop lobby composition (1280px and up): one viewport, no hidden overflow. If the content is
 * taller than the window, the shell grows and the page scrolls instead of clipping.
 */
export function LobbyShell({ pathname }: { pathname: string | null }) {
  return (
    <div className="relative isolate flex min-h-svh flex-col">
      <Backdrop />
      <SkipLink />
      <LobbyTopBar pathname={pathname} />
      <main
        id="main"
        tabIndex={-1}
        className="grid flex-1 grid-cols-[300px_minmax(0,1fr)_208px_56px] gap-x-8 pl-8 focus:outline-none"
      >
        <div className="flex flex-col gap-7 py-6">
          <CurrentWork items={workload} />
          <Identity />
        </div>
        <Stage />
        <FeatureTiles />
        <CollaboratorRail />
      </main>
    </div>
  );
}

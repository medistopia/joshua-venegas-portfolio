import { Backdrop } from "@/components/home/Backdrop";
import { CollaboratorRail } from "@/components/shell/Collaborators";
import { Footer } from "@/components/shell/Footer";
import { SkipLink } from "@/components/shell/SkipLink";
import { TopBar } from "@/components/shell/TopBar";

/**
 * The menu shell. From 1024px it fills exactly one viewport: the top bar and collaborator rail stay
 * put and each view renders in `main`, which scrolls if its content is taller (never clipped).
 * Below 1024px the page scrolls normally and the footer follows.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative isolate flex min-h-svh flex-col lg:h-svh">
      <Backdrop />
      <SkipLink />
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <main id="main" tabIndex={-1} className="relative min-w-0 flex-1 focus:outline-none lg:overflow-y-auto">
          {children}
        </main>
        <CollaboratorRail />
      </div>
      <div className="lg:hidden">
        <Footer />
      </div>
    </div>
  );
}

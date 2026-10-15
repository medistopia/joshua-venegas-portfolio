import type { ReactNode } from "react";
import { Footer } from "@/components/shell/Footer";
import { SkipLink } from "@/components/shell/SkipLink";
import { TopBar } from "@/components/shell/TopBar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SkipLink />
      <TopBar />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}

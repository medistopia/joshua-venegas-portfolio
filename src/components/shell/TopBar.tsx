import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { profile } from "@/content/profile";
import { BrandSlab } from "./BrandSlab";
import { MobileMenu, MobileMenuView } from "./MobileMenu";
import { NavTabList, NavTabs } from "./NavTabs";

export function TopBar() {
  const { resume } = profile.links;

  return (
    <header className="relative z-30 flex h-14 items-stretch border-b border-line bg-bg-deep/85 backdrop-blur-md">
      <BrandSlab />

      <nav aria-label="Primary" className="ml-3 hidden items-center lg:flex">
        <Suspense fallback={<NavTabList pathname={null} />}>
          <NavTabs />
        </Suspense>
      </nav>

      <div className="ml-auto flex items-center gap-3 pr-4 lg:pr-6">
        {resume && (
          <ButtonLink href={resume} variant="gold" className="hidden lg:inline-flex">
            Résumé
          </ButtonLink>
        )}
        <div className="lg:hidden">
          <Suspense fallback={<MobileMenuView pathname={null} />}>
            <MobileMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

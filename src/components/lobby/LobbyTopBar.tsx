import { BrandSlab } from "@/components/shell/BrandSlab";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { profile } from "@/content/profile";
import { IconTabList } from "./IconTabs";

export function LobbyTopBar({ pathname }: { pathname: string | null }) {
  const { resume } = profile.links;

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-stretch border-b border-line bg-bg-deep/85 backdrop-blur-md">
      <BrandSlab compact />
      <nav aria-label="Primary" className="ml-3 flex items-center">
        <IconTabList pathname={pathname} />
      </nav>
      {resume && (
        <div className="ml-auto flex items-center pr-6">
          <ButtonLink href={resume} variant="gold">
            Résumé
          </ButtonLink>
        </div>
      )}
    </header>
  );
}

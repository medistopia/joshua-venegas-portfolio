import { Monogram } from "@/components/brand/Monogram";

const tabs = ["Home", "Projects", "Experience", "About", "Contact"];

export function StudyTopBar() {
  return (
    <header className="relative z-20 flex h-14 items-stretch border-b border-line bg-bg-deep/85 backdrop-blur-md">
      <div className="clip-slab flex items-center gap-3 bg-coral pr-9 pl-4 text-bg-deep">
        <Monogram className="h-6 w-auto" />
        <span className="font-display text-xl font-bold tracking-wide uppercase">Joshua Venegas</span>
      </div>

      <div className="ml-3 hidden items-center gap-1 lg:flex">
        {tabs.map((tab, i) => (
          <span
            key={tab}
            className={
              i === 0
                ? "clip-tab bg-text px-6 py-1.5 font-display text-lg font-semibold tracking-wide text-bg-deep uppercase"
                : "px-5 py-1.5 font-display text-lg font-semibold tracking-wide text-text-muted uppercase"
            }
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="ml-auto flex items-center pr-4 lg:pr-6">
        <span className="label hidden border border-gold px-4 py-2 text-gold lg:inline-block">Résumé</span>
        <span className="label border border-line-strong px-4 py-2 text-text lg:hidden">Menu</span>
      </div>
    </header>
  );
}

import Link from "next/link";
import type { ComponentType } from "react";
import { BadgeIcon, BriefcaseIcon, EnvelopeIcon, HouseIcon, PersonIcon } from "@/components/icons/Icons";
import { isActive, navItems, type NavIcon } from "@/components/shell/navigation";

const icons: Record<NavIcon, ComponentType<{ className?: string }>> = {
  house: HouseIcon,
  briefcase: BriefcaseIcon,
  badge: BadgeIcon,
  person: PersonIcon,
  envelope: EnvelopeIcon,
};

/** Icon-and-label tabs. The selected tab keeps the light angled plate. */
export function IconTabList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-1">
      {navItems.map((item) => {
        const active = isActive(item.href, pathname);
        const Icon = icons[item.icon];
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-2 py-1.5 pr-5 pl-4 font-display text-lg font-semibold tracking-wide uppercase transition-colors duration-(--dur-fast) ${
                active ? "text-bg-deep" : "text-text-muted hover:text-text"
              }`}
            >
              <span
                aria-hidden="true"
                className={`clip-tab absolute inset-0 transition-colors duration-(--dur-fast) ${
                  active ? "bg-text" : "bg-transparent group-hover:bg-text/8"
                }`}
              />
              <Icon className="relative size-[18px]" />
              <span className="relative">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

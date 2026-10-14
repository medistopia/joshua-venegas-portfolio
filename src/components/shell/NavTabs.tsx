"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, navItems } from "./navigation";

export function NavTabs() {
  return <NavTabList pathname={usePathname()} />;
}

/** Rendered without an active tab while the pathname is unknown during prerendering. */
export function NavTabList({ pathname }: { pathname: string | null }) {
  return (
    <ul className="flex items-center gap-1">
      {navItems.map((item) => {
        const active = isActive(item.href, pathname);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group relative block px-5 py-1.5 font-display text-lg font-semibold tracking-wide uppercase transition-colors duration-(--dur-fast) ${
                active ? "text-bg-deep" : "text-text-muted hover:text-text"
              }`}
            >
              <span
                aria-hidden="true"
                className={`clip-tab absolute inset-0 transition-colors duration-(--dur-fast) ${
                  active ? "bg-text" : "bg-transparent group-hover:bg-text/8"
                }`}
              />
              <span className="relative">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

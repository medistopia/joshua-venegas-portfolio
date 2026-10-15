import Link from "next/link";
import { profile } from "@/content/profile";
import { navItems } from "./navigation";

const sourceUrl = "https://github.com/medistopia/joshua-venegas-portfolio";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-deep">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-10 lg:flex-row lg:items-start lg:justify-between lg:px-10">
        <div className="flex flex-col gap-2">
          <p className="font-display text-xl font-bold tracking-wide uppercase">
            {profile.name.first} {profile.name.last}
          </p>
          <p className="max-w-[52ch] text-sm text-text-muted">
            An original portfolio design inspired by game client menus. Not affiliated with or endorsed by Riot Games.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="label text-text-muted transition-colors duration-(--dur-fast) hover:text-text">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={sourceUrl} className="label text-text-muted transition-colors duration-(--dur-fast) hover:text-text">
                Source code
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

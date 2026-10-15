import type { CSSProperties } from "react";
import Link from "next/link";
import { profile } from "@/content/profile";

const tiles = [
  { href: "/experience", label: "Experience", lines: profile.roles },
  { href: "/about", label: "About", lines: ["UNG computer science", "Machine learning minor"] },
  { href: "/contact", label: "Contact", lines: ["Details being finalized"] },
];

export function PanelStack() {
  return (
    <nav aria-label="Sections" className="hidden lg:col-span-2 lg:block xl:col-span-1">
      {/* A row under the lineup from 1024px; the right-hand stack from 1280px. */}
      <ul className="grid grid-cols-3 gap-3 xl:flex xl:flex-col">
        {tiles.map((tile, i) => (
          <li key={tile.href} className="animate-rise" style={{ "--rise-delay": `${320 + i * 60}ms` } as CSSProperties}>
            <Link href={tile.href} className="group relative block h-full px-4 py-3">
              <span
                aria-hidden="true"
                className="clip-notch absolute inset-0 border-l-2 border-gold bg-surface backdrop-blur-md transition-colors duration-(--dur-fast) group-hover:border-teal group-hover:bg-surface-raised"
              />
              <span className="label relative block text-gold">{tile.label}</span>
              {tile.lines.map((line) => (
                <span key={line} className="relative mt-1 block text-sm leading-snug">
                  {line}
                </span>
              ))}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

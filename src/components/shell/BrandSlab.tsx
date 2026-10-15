import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";
import { profile } from "@/content/profile";

export function BrandSlab() {
  return (
    <Link
      href="/"
      className="group relative flex shrink-0 items-center gap-3 pr-9 pl-4 text-bg-deep outline-offset-[-4px]"
    >
      <span
        aria-hidden="true"
        className="clip-slab absolute inset-0 bg-coral transition-[filter] duration-(--dur-fast) group-hover:brightness-110"
      />
      <Monogram className="relative h-6 w-auto" />
      <span className="relative font-display text-xl font-bold tracking-wide whitespace-nowrap uppercase">
        {profile.name.first} {profile.name.last}
      </span>
    </Link>
  );
}

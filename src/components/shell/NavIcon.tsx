import { BadgeIcon, BriefcaseIcon, EnvelopeIcon, HouseIcon, PersonIcon } from "@/components/icons/Icons";
import type { NavIcon as NavIconName } from "./navigation";

const icons = {
  house: HouseIcon,
  briefcase: BriefcaseIcon,
  badge: BadgeIcon,
  person: PersonIcon,
  envelope: EnvelopeIcon,
} as const;

export function NavIcon({ name, className }: { name: NavIconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} />;
}

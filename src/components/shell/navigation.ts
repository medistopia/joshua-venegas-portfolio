export const navItems = [
  { href: "/", label: "Home", icon: "house" },
  { href: "/projects", label: "Projects", icon: "briefcase" },
  { href: "/experience", label: "Experience", icon: "badge" },
  { href: "/about", label: "About", icon: "person" },
  { href: "/contact", label: "Contact", icon: "envelope" },
] as const;

export type NavIcon = (typeof navItems)[number]["icon"];

export function isActive(href: string, pathname: string | null) {
  if (!pathname) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

import Link from "next/link";
import type { ComponentType } from "react";
import { EnvelopeIcon, PersonIcon } from "@/components/icons/Icons";
import { profile } from "@/content/profile";

type Action = { href: string; label: string; Icon: ComponentType<{ className?: string }> | null; external: boolean };

/** Compact identity block and direct actions. The résumé appears only once confirmed. */
export function Identity() {
  const actions: Action[] = [
    { href: "/about", label: "About", Icon: PersonIcon, external: false },
    { href: "/contact", label: "Contact", Icon: EnvelopeIcon, external: false },
  ];
  if (profile.links.resume) {
    actions.push({ href: profile.links.resume, label: "Résumé", Icon: null, external: true });
  }

  return (
    <div className="flex flex-col gap-6 lg:max-xl:gap-4">
      <div className="flex flex-col gap-3">
        <p className="label text-gold">{profile.eyebrow}</p>
        <h1 id="hero-name" className="font-display text-display-m font-bold uppercase">
          {profile.name.first} {profile.name.last}
        </h1>
        <ul className="label flex flex-col gap-1 text-text">
          {profile.roles.map((role) => (
            <li key={role}>{role}</li>
          ))}
        </ul>
        <p className="max-w-[34ch] text-sm leading-snug text-text-muted">{profile.headline}</p>
      </div>

      <ul className="flex max-w-[300px] flex-col gap-2 lg:max-w-none">
        {actions.map(({ href, label, Icon, external }) => {
          const className =
            "group relative flex h-11 items-center justify-between px-4 font-display text-lg font-semibold tracking-wide uppercase text-text transition-colors duration-(--dur-fast) hover:text-teal";
          const content = (
            <>
              <span
                aria-hidden="true"
                className="clip-notch absolute inset-0 border-l-2 border-gold bg-surface transition-colors duration-(--dur-fast) group-hover:bg-surface-raised"
              />
              <span className="relative">{label}</span>
              {Icon && <Icon className="relative size-[18px] text-text-muted transition-colors duration-(--dur-fast) group-hover:text-teal" />}
            </>
          );
          return (
            <li key={label}>
              {external ? (
                <a href={href} className={className}>
                  {content}
                </a>
              ) : (
                <Link href={href} className={className}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

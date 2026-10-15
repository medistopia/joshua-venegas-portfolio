import type { ReactNode } from "react";

/**
 * Original icon set: 24px grid, 1.75px stroke, square caps and mitred joins to match the
 * square-cornered UI. Icons are decorative; the adjacent label or aria-label names the control.
 */
function Icon({ className = "size-5", children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

type IconProps = { className?: string };

export function HouseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4Z" />
    </Icon>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 8h17v11.5h-17Z" />
      <path d="M9 8V4.5h6V8" />
      <path d="M3.5 13h17" />
      <path d="M10.5 13v2h3v-2" />
    </Icon>
  );
}

export function BadgeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 6.5h14v14H5Z" />
      <path d="M10 3.5h4v5h-4Z" />
      <path d="M12 11.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
      <path d="M8.5 18h7" />
    </Icon>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4a3.75 3.75 0 1 1 0 7.5A3.75 3.75 0 0 1 12 4Z" />
      <path d="M4.5 20.5c.6-4 3.6-6 7.5-6s6.9 2 7.5 6" />
    </Icon>
  );
}

export function EnvelopeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 5.5h17v13h-17Z" />
      <path d="m3.5 6.5 8.5 7 8.5-7" />
    </Icon>
  );
}

export function PeopleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
      <path d="M3 19.5c.5-3.2 2.8-5 6-5s5.5 1.8 6 5" />
      <path d="M15.5 5.3a3 3 0 0 1 0 5.4" />
      <path d="M17.5 14.8c2 .6 3.2 2.2 3.5 4.7" />
    </Icon>
  );
}

export function ChevronIcon({ direction, className }: IconProps & { direction: "left" | "right" }) {
  return (
    <Icon className={className}>
      <path d={direction === "left" ? "m14.5 6-6 6 6 6" : "m9.5 6 6 6-6 6"} />
    </Icon>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 5.5v13M16 5.5v13" />
    </Icon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7.5 5v14l11-7Z" />
    </Icon>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12h14" />
      <path d="m13 6.5 5.5 5.5-5.5 5.5" />
    </Icon>
  );
}

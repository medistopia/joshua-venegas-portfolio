import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  gold: "border-gold text-gold hover:bg-gold-soft",
  line: "border-line-strong text-text hover:border-text",
} as const;

type ButtonLinkProps = {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
};

/** App routes use client navigation; files and external URLs are plain anchors. */
export function ButtonLink({ href, variant = "line", className = "", children }: ButtonLinkProps) {
  const classes = `label inline-flex items-center border px-5 py-3 transition-colors duration-(--dur-fast) ${variants[variant]} ${className}`;

  if (href.startsWith("/") && !/\.[a-z0-9]+$/i.test(href)) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}

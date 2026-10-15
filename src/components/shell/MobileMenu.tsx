"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import { profile } from "@/content/profile";
import { isActive, navItems } from "./navigation";

export function MobileMenu() {
  return <MobileMenuView pathname={usePathname()} />;
}

export function MobileMenuView({ pathname }: { pathname: string | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const close = () => dialogRef.current?.close();

  /** A modal dialog lets Tab escape to the browser UI; wrap it within the menu instead. */
  const wrapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
        className="label border border-line-strong px-4 py-2 text-text transition-colors duration-(--dur-fast) hover:border-text"
      >
        Menu
      </button>

      <dialog
        ref={dialogRef}
        id="site-menu"
        aria-label="Site menu"
        onKeyDown={wrapFocus}
        onClose={() => {
          setOpen(false);
          buttonRef.current?.focus();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col bg-bg-deep p-0 text-text backdrop:bg-bg-deep/80 open:flex"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line pr-4 pl-4">
          <span className="label text-text-muted">Menu</span>
          <button
            type="button"
            onClick={close}
            className="label border border-line-strong px-4 py-2 transition-colors duration-(--dur-fast) hover:border-text"
          >
            Close
          </button>
        </div>

        <nav aria-label="Primary" className="px-4 pt-8">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={`group relative block py-2 pr-6 pl-4 font-display text-4xl font-bold uppercase ${
                      active ? "text-bg-deep" : "text-text"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`clip-tab absolute inset-0 transition-colors duration-(--dur-fast) ${
                        active ? "bg-text" : "group-hover:bg-text/8"
                      }`}
                    />
                    <span className="relative">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p className="label mt-auto border-t border-line px-4 py-4 text-text-muted">
          {profile.name.first} {profile.name.last}
        </p>
      </dialog>
    </>
  );
}

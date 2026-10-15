import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { candidates, modes } from "./_lib/candidates";

export const metadata: Metadata = {
  title: "Composition studies",
  robots: { index: false, follow: false },
};

export default function CompositionIndex() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <div>
        <p className="label text-text-muted">Phase 1, development only</p>
        <h1 className="mt-2 font-display text-display-l font-bold uppercase">Composition studies</h1>
      </div>
      <ul className="flex flex-col gap-4">
        {candidates.map((c) => (
          <li key={c.id} className="border border-line p-4">
            <p className="font-display text-2xl font-bold uppercase">
              {c.id.toUpperCase()}. {c.name}
            </p>
            <p className="mt-1 text-sm text-text-muted">{c.description}</p>
            <p className="mt-1 text-xs text-text-muted">{c.source}</p>
            <div className="mt-3 flex gap-4">
              {modes.map((mode) => (
                <Link key={mode} href={`/lab/composition/${c.id}/${mode}`} className="label text-teal underline-offset-4 hover:underline">
                  {mode}
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

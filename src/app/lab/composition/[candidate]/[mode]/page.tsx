import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompositionStudy } from "../../_components/CompositionStudy";
import { candidates, findCandidate, modes, type Mode } from "../../_lib/candidates";

export const instant = false;

export const metadata: Metadata = {
  title: "Composition study",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return candidates.flatMap((c) => modes.map((mode) => ({ candidate: c.id, mode })));
}

export default async function Page({ params }: PageProps<"/lab/composition/[candidate]/[mode]">) {
  if (process.env.NODE_ENV === "production") notFound();

  const { candidate: id, mode } = await params;
  const candidate = findCandidate(id);
  if (!candidate || !modes.includes(mode as Mode)) notFound();

  return <CompositionStudy candidate={candidate} guides={mode === "guides"} />;
}

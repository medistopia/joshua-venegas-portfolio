import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LobbyShell } from "@/components/lobby/LobbyShell";

export const metadata: Metadata = {
  title: "Lobby composition",
  robots: { index: false, follow: false },
};

/** Development only: the revised desktop lobby for review before it replaces the homepage. */
export default function LobbyComposition() {
  if (process.env.NODE_ENV === "production") notFound();
  return <LobbyShell pathname="/" />;
}

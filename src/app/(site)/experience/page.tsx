import type { Metadata } from "next";
import { ExperienceRows } from "@/components/ui/ExperienceRows";
import { InProgressNote, PageBody, PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <PageBody>
      <PageHeader eyebrow="Experience" title="Current roles">
        Leadership, founding work, and study.
      </PageHeader>
      <InProgressNote>Details and dates in progress</InProgressNote>
      <ExperienceRows />
    </PageBody>
  );
}

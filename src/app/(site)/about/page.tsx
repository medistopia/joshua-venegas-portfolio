import type { Metadata } from "next";
import { InProgressNote, PageBody, PageHeader } from "@/components/ui/PageHeader";
import { profile } from "@/content/profile";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageBody>
      <PageHeader eyebrow="About" title={`${profile.name.first} ${profile.name.last}`}>
        {profile.headline}
      </PageHeader>
      <InProgressNote>Full biography in progress</InProgressNote>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-5">
          {profile.about.map((paragraph) => (
            <p key={paragraph} className="max-w-[60ch] text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <dl className="flex flex-col gap-4 border-l-2 border-gold bg-surface-solid px-5 py-4">
          <div>
            <dt className="label text-gold">Education</dt>
            <dd className="mt-1">{profile.education}</dd>
          </div>
          <div>
            <dt className="label text-gold">Roles</dt>
            {profile.roles.map((role) => (
              <dd key={role} className="mt-1">
                {role}
              </dd>
            ))}
          </div>
        </dl>
      </div>
    </PageBody>
  );
}

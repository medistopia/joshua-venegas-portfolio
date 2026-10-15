import type { Metadata } from "next";
import { InProgressNote, Panel, SectionLabel, ViewFrame } from "@/components/views/ViewFrame";
import { profile } from "@/content/profile";

export const metadata: Metadata = { title: "About" };

const sourceUrl = "https://github.com/medistopia/joshua-venegas-portfolio";

export default function AboutPage() {
  return (
    <ViewFrame kicker="About" title={`${profile.name.first} ${profile.name.last}`} intro={profile.headline}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5">
            {profile.about.map((paragraph) => (
              <p key={paragraph} className="max-w-[60ch] text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <section aria-labelledby="interests-heading" className="flex flex-col gap-3">
            <SectionLabel id="interests-heading">Interests</SectionLabel>
            <ul className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <li key={interest} className="border border-line-strong px-3 py-1.5 text-sm">
                  {interest}
                </li>
              ))}
            </ul>
          </section>
          <InProgressNote>Full biography in progress</InProgressNote>
        </div>

        <div className="flex flex-col gap-4">
          <Panel className="border-l-2 border-l-gold px-5 py-4">
            <dl className="flex flex-col gap-4">
              <div>
                <dt className="label text-gold">Education</dt>
                <dd className="mt-1">{profile.education}</dd>
                {profile.expectedGraduation && (
                  <dd className="mt-1 text-sm text-text-muted">Expected graduation: {profile.expectedGraduation}</dd>
                )}
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
          </Panel>
          {/* Phones and tablets show this in the footer. */}
          <Panel className="hidden flex-col gap-2 px-5 py-4 lg:flex">
            <h2 className="label text-text-muted">About this site</h2>
            <p className="text-sm text-text-muted">
              An original portfolio design inspired by game client menus. Not affiliated with or endorsed by Riot Games.
            </p>
            <a href={sourceUrl} className="label self-start text-text-muted underline-offset-4 hover:text-text hover:underline">
              Source code
            </a>
          </Panel>
        </div>
      </div>
    </ViewFrame>
  );
}

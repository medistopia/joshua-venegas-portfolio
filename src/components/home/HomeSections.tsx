import { ButtonLink } from "@/components/ui/ButtonLink";
import { ContactActions } from "@/components/ui/ContactActions";
import { ExperienceRows } from "@/components/ui/ExperienceRows";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/content/profile";

/** Short sections below the fold: Experience snapshot, About teaser, Contact panel. */
export function HomeSections() {
  return (
    <div className="mx-auto grid max-w-[1440px] gap-16 px-4 py-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20 lg:px-10 lg:py-24">
      <section aria-labelledby="experience-heading" className="flex flex-col gap-8">
        <SectionHeading id="experience-heading" eyebrow="Experience" title="Current roles" />
        <ExperienceRows />
        <div>
          <ButtonLink href="/experience">View experience</ButtonLink>
        </div>
      </section>

      <div className="flex flex-col gap-16">
        <section aria-labelledby="about-heading" className="flex flex-col gap-6">
          <SectionHeading id="about-heading" eyebrow="About" title="Background" />
          {profile.about.map((paragraph) => (
            <p key={paragraph} className="max-w-[60ch] text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
          <div>
            <ButtonLink href="/about">More about me</ButtonLink>
          </div>
        </section>

        <section aria-labelledby="contact-heading" className="relative flex flex-col gap-6 px-6 py-6">
          <span aria-hidden="true" className="clip-notch absolute inset-0 border-l-2 border-gold bg-surface-solid" />
          <div className="relative flex flex-col gap-6">
            <SectionHeading id="contact-heading" eyebrow="Contact" title="Get in touch" />
            <ContactActions />
          </div>
        </section>
      </div>
    </div>
  );
}

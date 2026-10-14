import { ButtonLink } from "@/components/ui/ButtonLink";
import { profile } from "@/content/profile";

export function Hero() {
  const { resume } = profile.links;

  return (
    <section aria-labelledby="hero-name" className="relative pt-24 lg:pt-0">
      <div className="animate-rise">
        <p className="label text-gold">{profile.eyebrow}</p>
        <h1
          id="hero-name"
          className="mt-4 font-display text-display-xl font-bold uppercase short:mt-3 short:text-display-xl-short"
        >
          <span className="block">{profile.name.first}</span>
          <span className="block">{profile.name.last}</span>
        </h1>
        <p className="mt-5 max-w-[28ch] text-lg leading-snug lg:text-xl short:mt-4 short:text-lg">{profile.headline}</p>
        <div className="mt-7 flex flex-wrap gap-3 short:mt-5">
          {resume && (
            <ButtonLink href={resume} variant="gold">
              Résumé
            </ButtonLink>
          )}
          <ButtonLink href="/contact" variant={resume ? "line" : "gold"}>
            Contact
          </ButtonLink>
          <ButtonLink href="/about">About</ButtonLink>
        </div>
      </div>
    </section>
  );
}

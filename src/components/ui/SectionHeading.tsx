type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
};

export function SectionHeading({ id, eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="label text-gold">{eyebrow}</p>
      <h2 id={id} className="font-display text-display-l font-bold uppercase">
        {title}
      </h2>
    </div>
  );
}

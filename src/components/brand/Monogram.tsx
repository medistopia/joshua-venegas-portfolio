const J = "M34 40H82V132L62 156H30V136H54L62 128V58H34Z";
const V = "M96 40H118L142 124L166 40H188L154 160H130Z";
const FRAME = "M110 6L212 38V150L110 196L8 150V38Z";
const INNER_FRAME = "M110 20L198 48V142L110 182L22 142V48Z";

type MonogramProps = {
  className?: string;
  /** "mark" is the letters only; "emblem" adds the faceted frame and a lit gradient. */
  variant?: "mark" | "emblem";
  /** Must be unique per page: a gradient defined inside a hidden SVG does not paint. */
  gradientId?: string;
};

export function Monogram({ className, variant = "mark", gradientId = "jv-emblem-light" }: MonogramProps) {
  if (variant === "mark") {
    return (
      <svg viewBox="0 0 220 200" className={className} aria-hidden="true" focusable="false">
        <path d={J} fill="currentColor" />
        <path d={V} fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3d79c" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#c9a55c" stopOpacity="0.35" />
          <stop offset="1" stopColor="#c9a55c" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={FRAME} fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" />
      <path d={INNER_FRAME} fill="none" stroke={`url(#${gradientId})`} strokeWidth="0.75" />
      <path d={J} fill={`url(#${gradientId})`} />
      <path d={V} fill={`url(#${gradientId})`} />
    </svg>
  );
}

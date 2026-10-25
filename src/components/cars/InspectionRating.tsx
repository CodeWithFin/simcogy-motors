const styles = {
  good: "bg-forest/15 text-[#3d6b38]",
  fair: "bg-solar/20 text-[#7a5200]",
  needs_attention: "bg-canyon/15 text-[#a8321a]",
} as const;

const dots = {
  good: "bg-forest",
  fair: "bg-solar",
  needs_attention: "bg-canyon",
} as const;

const labels = {
  good: "Good",
  fair: "Fair",
  needs_attention: "Needs attention",
} as const;

type Rating = keyof typeof styles;

export function InspectionRating({ rating }: { rating: Rating }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-chip px-3 py-1 text-xs font-medium ${styles[rating]}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dots[rating]}`} />
      {labels[rating]}
    </span>
  );
}

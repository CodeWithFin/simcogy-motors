/** Color-coded inspection ratings — shades tuned for contrast on both themes. */
const styles = {
  good: "bg-success/15 text-success border-success/30",
  fair: "bg-accent/15 text-accent border-accent/30",
  needs_attention: "bg-destructive/15 text-destructive border-destructive/30",
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
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${styles[rating]}`}
    >
      <span aria-hidden>
        {rating === "good" ? "●" : rating === "fair" ? "◐" : "○"}
      </span>
      {labels[rating]}
    </span>
  );
}

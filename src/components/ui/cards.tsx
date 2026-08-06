import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: string | number;
  title: string;
  subtitle: string;
  imageUrl: string;
  /** Optional destination when the card is clicked */
  href?: string;
}

export interface HoverRevealCardsProps {
  items: CardItem[];
  className?: string;
  cardClassName?: string;
}

/**
 * Grid of cards with a hover-reveal effect.
 * Hovered/focused card stands out; siblings de-emphasize.
 */
export function HoverRevealCards({
  items,
  className,
  cardClassName,
}: HoverRevealCardsProps) {
  return (
    <div
      role="list"
      className={cn(
        "group grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {items.map((item) => {
        const classes = cn(
          "relative block h-80 cursor-pointer overflow-hidden rounded-xl bg-cover bg-center shadow-lg transition-all duration-500 ease-in-out",
          "group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px]",
          "hover:!scale-105 hover:!opacity-100 hover:!blur-none",
          "focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          cardClassName
        );

        const content = (
          <>
            {/* Dark gradient for text contrast — intentional on photos in both themes */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="text-sm font-light uppercase tracking-widest opacity-80">
                {item.subtitle}
              </p>
              <h3 className="mt-1 text-2xl font-semibold">{item.title}</h3>
            </div>
          </>
        );

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              role="listitem"
              aria-label={`${item.title}, ${item.subtitle}`}
              className={classes}
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            >
              {content}
            </Link>
          );
        }

        return (
          <div
            key={item.id}
            role="listitem"
            aria-label={`${item.title}, ${item.subtitle}`}
            tabIndex={0}
            className={classes}
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

export default HoverRevealCards;

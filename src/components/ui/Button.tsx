import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "solar"
  | "graphite"
  | "light"
  | "white"
  | "ghost-light"
  | "ghost-dark";

export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  // Solar is the single chromatic action — use it at most once per screen.
  solar: "bg-solar text-graphite hover:brightness-95",
  graphite: "bg-graphite text-paper hover:bg-charcoal",
  light: "bg-concrete text-graphite hover:bg-ash",
  white: "bg-paper text-pure-black hover:bg-chalk",
  "ghost-light": "border border-paper text-paper hover:bg-paper/10",
  "ghost-dark": "border border-graphite text-graphite hover:bg-graphite/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-sm font-semibold rounded-full",
  md: "h-12 px-6 text-sm rounded-button",
  lg: "h-14 min-w-[160px] px-6 text-sm rounded-button",
};

export function buttonClass(
  variant: ButtonVariant = "graphite",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );
}

type LinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  external?: boolean;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant,
  size,
  className,
  external,
  children,
}: LinkProps) {
  const classes = buttonClass(variant, size, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

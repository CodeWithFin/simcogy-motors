import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "ghost" | "accent" | "outline";
  className?: string;
};

export function ArrowLink({
  href,
  children,
  variant = "ghost",
  className = "",
}: Props) {
  const base =
    "group inline-flex items-center space-x-3 font-light transition-colors";

  if (variant === "accent") {
    return (
      <Link href={href} className={`${base} ${className}`}>
        <span className="text-lg group-hover:text-accent transition-colors">
          {children}
        </span>
        <span className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground group-hover:scale-105 transition-transform">
          <ArrowIcon />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} text-lg hover:text-accent ${className}`}
    >
      <span>{children}</span>
      <span className="w-8 h-8 rounded-full border border-overlay flex items-center justify-center group-hover:border-accent transition-colors">
        <ArrowIcon />
      </span>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

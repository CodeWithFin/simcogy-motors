import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-accent text-xs uppercase tracking-wider mb-4">404</p>
        <h1 className="text-4xl font-medium tracking-tight mb-4">
          Page not found
        </h1>
        <Link href="/" className="text-sm text-muted hover:text-accent">
          Back home
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LogoutButton } from "@/components/admin/LogoutButton";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/cars", label: "Cars" },
  { href: "/admin/featured", label: "Featured" },
  { href: "/admin/cars/new", label: "Add car" },
  { href: "/admin/leads", label: "Leads" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="hidden md:flex w-56 border-r border-border flex-col p-6 sticky top-0 h-screen bg-card">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/admin"
            className="tracking-tighter font-medium uppercase text-sm"
          >
            Simcogy Admin
          </Link>
          <ThemeToggle />
        </div>
        <nav className="flex flex-col gap-3 flex-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-light text-muted-foreground hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground mt-4 transition-colors"
        >
          ← Site
        </Link>
      </aside>
      <div className="md:hidden fixed top-0 inset-x-0 z-40 glass-panel bg-card/95 px-4 py-3 flex items-center gap-4 overflow-x-auto">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-xs whitespace-nowrap text-muted-foreground"
          >
            {item.label}
          </Link>
        ))}
        <div className="ml-auto shrink-0">
          <ThemeToggle />
        </div>
      </div>
      <main className="flex-1 p-6 md:p-10 max-w-6xl pt-16 md:pt-10">
        {children}
      </main>
    </div>
  );
}

import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/cars", label: "Cars" },
  { href: "/admin/cars/new", label: "Add car" },
  { href: "/admin/leads", label: "Leads" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-56 border-r border-border flex-col p-6 sticky top-0 h-screen">
        <Link
          href="/admin"
          className="tracking-tighter font-medium uppercase text-sm mb-10"
        >
          Simcogy Admin
        </Link>
        <nav className="flex flex-col gap-3 flex-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-light text-muted hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
        <Link
          href="/"
          className="text-xs text-muted hover:text-white mt-4 transition-colors"
        >
          ← Site
        </Link>
      </aside>
      <div className="md:hidden fixed top-0 inset-x-0 z-40 glass-panel px-4 py-3 flex gap-4 overflow-x-auto">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-xs whitespace-nowrap text-muted"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <main className="flex-1 p-6 md:p-10 max-w-6xl pt-16 md:pt-10">
        {children}
      </main>
    </div>
  );
}

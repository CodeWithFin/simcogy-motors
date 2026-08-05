import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-border flex flex-col md:flex-row items-center justify-between text-xs font-light text-muted">
      <p>&copy; {new Date().getFullYear()} Simcogy Motors. All rights reserved.</p>
      <div className="flex space-x-6 mt-4 md:mt-0">
        <Link href="/cars" className="hover:text-white transition-colors">
          Inventory
        </Link>
        <Link href="/admin/login" className="hover:text-white transition-colors">
          Staff
        </Link>
      </div>
    </footer>
  );
}

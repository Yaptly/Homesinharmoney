import Link from "next/link";
import { HouseMark } from "@/components/HouseMark";
import { LogoutButton } from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/staff", label: "Staff" },
];

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b border-line bg-cream/95 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <HouseMark className="w-9 h-9" />
            <span className="font-display text-lg text-sage-deep">Homes In Harmony</span>
          </Link>
          <LogoutButton />
        </div>
        <nav aria-label="Admin navigation" className="max-w-6xl mx-auto px-5 overflow-x-auto">
          <div className="flex min-w-max gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="tracked-caps text-xs text-charcoal-soft hover:text-sage-deep border-b-2 border-transparent hover:border-sage-deep pb-3 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <div className="max-w-6xl mx-auto px-5 py-9">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-sage-deep">{title}</h1>
          {description ? <p className="text-charcoal-soft mt-2">{description}</p> : null}
        </div>
        {children}
      </div>
    </main>
  );
}

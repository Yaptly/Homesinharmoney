import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

const TZ = "America/New_York";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: role } = await supabase.rpc("current_staff_role");
  if (role === "staff") redirect("/staff/schedule");
  if (role !== "owner") redirect("/admin/login");

  const now = new Date().toISOString();
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);

  const [
    { count: requestedCount },
    { count: unassignedCount },
    { count: weekCount },
    { data: rawNextBookings },
  ] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "requested").gte("start_time", now),
    supabase.from("bookings").select("id", { count: "exact", head: true }).is("assigned_staff_id", null).in("status", ["requested", "confirmed"]).gte("start_time", now),
    supabase.from("bookings").select("id", { count: "exact", head: true }).in("status", ["requested", "confirmed"]).gte("start_time", now).lte("start_time", weekEnd.toISOString()),
    supabase
      .from("bookings")
      .select("id, start_time, status, assigned_staff_id, clients(full_name), services(name), staff(full_name)")
      .in("status", ["requested", "confirmed"])
      .gte("start_time", now)
      .order("start_time")
      .limit(6),
  ]);

  const nextBookings = (rawNextBookings ?? []).map((booking) => ({
    ...booking,
    clients: Array.isArray(booking.clients) ? booking.clients[0] ?? null : booking.clients,
    services: Array.isArray(booking.services) ? booking.services[0] ?? null : booking.services,
    staff: Array.isArray(booking.staff) ? booking.staff[0] ?? null : booking.staff,
  }));

  const cards = [
    { label: "Pending requests", value: requestedCount ?? 0, href: "/admin/bookings" },
    { label: "Unassigned", value: unassignedCount ?? 0, href: "/admin/bookings" },
    { label: "Next 7 days", value: weekCount ?? 0, href: "/admin/calendar" },
  ];

  return (
    <AdminShell title="Overview" description="The work that needs your attention right now.">
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="border border-line rounded-xl p-5 hover:border-sage-deep hover:-translate-y-0.5 transition-all">
            <p className="tracked-caps text-xs text-charcoal-soft">{card.label}</p>
            <p className="font-display text-4xl text-sage-deep mt-3">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="font-display text-2xl text-sage-deep">Next Bookings</h2>
        <Link href="/admin/bookings" className="tracked-caps text-xs text-sage-deep underline underline-offset-4">Manage all</Link>
      </div>
      <div className="space-y-3">
        {nextBookings.length === 0 ? <p className="text-charcoal-soft">No upcoming bookings.</p> : null}
        {nextBookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/admin/bookings?booking=${booking.id}`}
            className="border border-line rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-sage-deep transition-colors"
          >
            <div>
              <p className="font-display text-lg text-sage-deep">
                {new Date(booking.start_time).toLocaleString("en-US", {
                  timeZone: TZ,
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-charcoal-soft mt-1">{booking.services?.name} — {booking.clients?.full_name}</p>
              <p className="text-sm text-charcoal-soft/70 mt-1">
                {booking.staff?.full_name ?? "Unassigned"}
              </p>
            </div>
            <span className="tracked-caps text-xs bg-sage-tint text-sage-deep rounded-full px-3 py-1.5 self-start sm:self-center">
              {booking.status}
            </span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}

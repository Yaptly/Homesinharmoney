import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNewBookingForm } from "@/components/admin/AdminNewBookingForm";
import { BookingEditor } from "@/components/admin/BookingEditor";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string; status?: string }>;
}) {
  const { booking: selectedId, status = "active" } = await searchParams;
  const supabase = await createClient();
  const { data: role } = await supabase.rpc("current_staff_role");
  if (role === "staff") redirect("/staff/schedule");
  if (role !== "owner") redirect("/admin/login");

  const [{ data: rawBookings }, { data: services }, { data: staff }] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, service_id, start_time, status, address_line1, address_line2, city, zip, notes, assigned_staff_id, quoted_price_cents, clients(full_name, phone, email), services(name)")
      .order("start_time", { ascending: true })
      .limit(150),
    supabase.from("services").select("id, name, duration_minutes, base_price_cents").eq("active", true).order("sort_order"),
    supabase.from("staff").select("id, full_name, active").eq("active", true).order("full_name"),
  ]);

  const normalized = (rawBookings ?? []).map((item) => ({
    ...item,
    clients: Array.isArray(item.clients) ? item.clients[0] ?? null : item.clients,
    services: Array.isArray(item.services) ? item.services[0] ?? null : item.services,
  }));

  const bookings = normalized.filter((item) => {
    if (status === "completed") return item.status === "completed";
    if (status === "cancelled") return item.status === "cancelled";
    return item.status === "requested" || item.status === "confirmed";
  });

  return (
    <AdminShell title="Bookings" description="Create, edit, assign, confirm, and complete every visit.">
      <div className="mb-7">
        <AdminNewBookingForm services={services ?? []} staffOptions={staff ?? []} />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <a href="/admin/bookings" className="tracked-caps text-xs border border-line rounded-full px-4 py-2 hover:bg-sage-tint">Active</a>
        <a href="/admin/bookings?status=completed" className="tracked-caps text-xs border border-line rounded-full px-4 py-2 hover:bg-sage-tint">Completed</a>
        <a href="/admin/bookings?status=cancelled" className="tracked-caps text-xs border border-line rounded-full px-4 py-2 hover:bg-sage-tint">Cancelled</a>
      </div>
      <div className="space-y-4">
        {bookings.length === 0 ? <p className="text-charcoal-soft">No bookings in this view.</p> : null}
        {bookings.map((item) => (
          <BookingEditor
            key={item.id}
            booking={item}
            services={services ?? []}
            staff={staff ?? []}
            initiallyOpen={selectedId === item.id}
          />
        ))}
      </div>
    </AdminShell>
  );
}

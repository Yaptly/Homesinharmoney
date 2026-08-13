import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { WeeklyCalendar } from "@/components/admin/WeeklyCalendar";

export default async function AdminCalendarPage() {
  const supabase = await createClient();
  const { data: role } = await supabase.rpc("current_staff_role");
  if (role === "staff") redirect("/staff/schedule");
  if (role !== "owner") redirect("/admin/login");

  const rangeStart = new Date();
  rangeStart.setDate(rangeStart.getDate() - 30);
  const rangeEnd = new Date();
  rangeEnd.setDate(rangeEnd.getDate() + 120);

  const [{ data: rawBookings }, { data: staff }] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, start_time, status, assigned_staff_id, address_line1, clients(full_name), services(name, duration_minutes)")
      .gte("start_time", rangeStart.toISOString())
      .lte("start_time", rangeEnd.toISOString())
      .in("status", ["requested", "confirmed"])
      .order("start_time"),
    supabase.from("staff").select("id, full_name").eq("active", true).order("full_name"),
  ]);

  const bookings = (rawBookings ?? []).map((booking) => ({
    ...booking,
    clients: Array.isArray(booking.clients) ? booking.clients[0] ?? null : booking.clients,
    services: Array.isArray(booking.services) ? booking.services[0] ?? null : booking.services,
  }));

  return (
    <AdminShell title="Calendar" description="View upcoming work by week and filter by cleaner.">
      <WeeklyCalendar bookings={bookings} staff={staff ?? []} />
    </AdminShell>
  );
}

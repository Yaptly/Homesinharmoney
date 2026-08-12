import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { HouseMark } from "@/components/HouseMark";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { BookingRow } from "@/components/admin/BookingRow";
import { BlockDateForm } from "@/components/admin/BlockDateForm";
import { StaffPanel } from "@/components/admin/StaffPanel";
import { AdminNewBookingForm } from "@/components/admin/AdminNewBookingForm";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: role } = await supabase.rpc("current_staff_role");
  if (role === "staff") redirect("/staff/schedule");
  if (!role) redirect("/admin/login");

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, start_time, status, recurrence, notes, address_line1, city, assigned_staff_id, quoted_price_cents, lead_source, clients(full_name, phone, email), services(name)"
    )
    .in("status", ["requested", "confirmed"])
    .order("start_time", { ascending: true })
    .limit(50);

  const { data: services } = await supabase
    .from("services")
    .select("id, name, duration_minutes, base_price_cents")
    .eq("active", true)
    .order("sort_order");

  const { data: allStaff } = await supabase
    .from("staff")
    .select("id, full_name, phone, email, active")
    .order("created_at", { ascending: false });

  const { data: settingsRow } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "staff_invite_code")
    .single();

  const activeStaffOptions = (allStaff ?? []).filter((s) => s.active);

  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name, phone, email, city")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: blockedDates } = await supabase
    .from("blocked_dates")
    .select("*")
    .gte("date", new Date().toISOString().slice(0, 10))
    .order("date");

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <HouseMark className="w-10 h-10" />
            <p className="font-display text-xl text-sage-deep">Admin Dashboard</p>
          </div>
          <LogoutButton />
        </div>

        <section className="mb-14">
          <h2 className="font-display text-2xl text-sage-deep mb-5">
            Upcoming Bookings ({bookings?.length ?? 0})
          </h2>
          <AdminNewBookingForm services={services ?? []} staffOptions={activeStaffOptions} />
          <div className="space-y-3">
            {(bookings ?? []).length === 0 && (
              <p className="text-charcoal-soft">No upcoming bookings yet.</p>
            )}
            {(bookings ?? []).map((b) => {
              const clients = Array.isArray(b.clients) ? b.clients[0] : b.clients;
              const services = Array.isArray(b.services) ? b.services[0] : b.services;
              return (
                <BookingRow
                  key={b.id}
                  booking={{ ...b, clients: clients ?? null, services: services ?? null }}
                  staffOptions={activeStaffOptions}
                />
              );
            })}
          </div>
        </section>

        <div className="hairline mb-14" />

        <section className="mb-14">
          <h2 className="font-display text-2xl text-sage-deep mb-5">Staff</h2>
          <StaffPanel staff={allStaff ?? []} inviteCode={settingsRow?.value ?? ""} />
        </section>

        <div className="hairline mb-14" />

        <section className="mb-14">
          <h2 className="font-display text-2xl text-sage-deep mb-5">Blocked Dates</h2>
          <BlockDateForm />
          <div className="mt-5 flex flex-wrap gap-2">
            {(blockedDates ?? []).map((d) => (
              <span key={d.id} className="tracked-caps text-xs bg-sage-tint text-sage-deep px-3 py-1.5 rounded-full">
                {d.date} {d.reason ? `· ${d.reason}` : ""}
              </span>
            ))}
          </div>
        </section>

        <div className="hairline mb-14" />

        <section>
          <h2 className="font-display text-2xl text-sage-deep mb-5">
            Clients ({clients?.length ?? 0})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="tracked-caps text-charcoal-soft/70 border-b border-line">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Phone</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">City</th>
                </tr>
              </thead>
              <tbody>
                {(clients ?? []).map((c) => (
                  <tr key={c.id} className="border-b border-line/60">
                    <td className="py-2 pr-4">{c.full_name}</td>
                    <td className="py-2 pr-4">{c.phone}</td>
                    <td className="py-2 pr-4">{c.email ?? "—"}</td>
                    <td className="py-2 pr-4">{c.city ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

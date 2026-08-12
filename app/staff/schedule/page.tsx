import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HouseMark } from "@/components/HouseMark";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { StaffBookingRow } from "@/components/staff/StaffBookingRow";

export default async function StaffSchedulePage() {
  const supabase = await createClient();

  const { data: role } = await supabase.rpc("current_staff_role");
  if (!role) redirect("/admin/login");

  const { data: staffRow } = await supabase
    .from("staff")
    .select("full_name")
    .eq("auth_user_id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, start_time, status, recurrence, notes, address_line1, address_line2, city, clients(full_name, phone), services(name)"
    )
    .in("status", ["confirmed", "requested"])
    .order("start_time", { ascending: true });

  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <HouseMark className="w-10 h-10" />
            <div>
              <p className="font-display text-xl text-sage-deep">My Schedule</p>
              {staffRow && <p className="text-sm text-charcoal-soft">{staffRow.full_name}</p>}
            </div>
          </div>
          <LogoutButton />
        </div>

        <div className="space-y-3">
          {(bookings ?? []).length === 0 && (
            <p className="text-charcoal-soft">No jobs on your schedule right now.</p>
          )}
          {(bookings ?? []).map((b) => {
            const clients = Array.isArray(b.clients) ? b.clients[0] : b.clients;
            const services = Array.isArray(b.services) ? b.services[0] : b.services;
            return (
              <StaffBookingRow
                key={b.id}
                booking={{ ...b, clients: clients ?? null, services: services ?? null }}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

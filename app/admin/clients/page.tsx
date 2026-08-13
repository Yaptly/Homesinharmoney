import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: role } = await supabase.rpc("current_staff_role");
  if (role === "staff") redirect("/staff/schedule");
  if (role !== "owner") redirect("/admin/login");

  const { data: clients } = await supabase
    .from("clients")
    .select("id, full_name, phone, email, address_line1, city, zip, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <AdminShell title="Clients" description="Customer contact details and service locations in one place.">
      <div className="border border-line rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead className="bg-sage-tint/40">
              <tr className="tracked-caps text-xs text-charcoal-soft">
                <th className="p-4">Client</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Service address</th>
              </tr>
            </thead>
            <tbody>
              {(clients ?? []).map((client) => (
                <tr key={client.id} className="border-t border-line">
                  <td className="p-4 font-display text-base text-sage-deep">{client.full_name}</td>
                  <td className="p-4"><a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a></td>
                  <td className="p-4">{client.email ? <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a> : "—"}</td>
                  <td className="p-4 text-charcoal-soft">{[client.address_line1, client.city, client.zip].filter(Boolean).join(", ") || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(clients ?? []).length === 0 ? <p className="p-5 text-charcoal-soft">No clients yet.</p> : null}
      </div>
    </AdminShell>
  );
}

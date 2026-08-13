import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { StaffPanel } from "@/components/admin/StaffPanel";
import { BlockDateForm } from "@/components/admin/BlockDateForm";

export default async function AdminStaffPage() {
  const supabase = await createClient();
  const { data: role } = await supabase.rpc("current_staff_role");
  if (role === "staff") redirect("/staff/schedule");
  if (role !== "owner") redirect("/admin/login");

  const [{ data: staff }, { data: settings }, { data: blockedDates }] = await Promise.all([
    supabase.from("staff").select("id, full_name, phone, email, active").order("created_at", { ascending: false }),
    supabase.from("app_settings").select("value").eq("key", "staff_invite_code").single(),
    supabase.from("blocked_dates").select("id, date, reason").gte("date", new Date().toISOString().slice(0, 10)).order("date"),
  ]);

  return (
    <AdminShell title="Staff" description="Invite cleaners, approve access, and manage business closures.">
      <section>
        <StaffPanel staff={staff ?? []} inviteCode={settings?.value ?? ""} />
      </section>
      <section className="mt-12 pt-10 border-t border-line">
        <h2 className="font-display text-2xl text-sage-deep mb-5">Blocked Dates</h2>
        <BlockDateForm />
        <div className="mt-5 flex flex-wrap gap-2">
          {(blockedDates ?? []).map((date) => (
            <span key={date.id} className="tracked-caps text-xs bg-sage-tint text-sage-deep px-3 py-1.5 rounded-full">
              {date.date}{date.reason ? ` · ${date.reason}` : ""}
            </span>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

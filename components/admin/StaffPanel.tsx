"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Staff = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  active: boolean;
};

export function StaffPanel({ staff, inviteCode }: { staff: Staff[]; inviteCode: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [code, setCode] = useState(inviteCode);
  const [savingCode, setSavingCode] = useState(false);

  const pending = staff.filter((s) => !s.active);
  const active = staff.filter((s) => s.active);

  async function approve(id: string) {
    await supabase.from("staff").update({ active: true }).eq("id", id);
    router.refresh();
  }

  async function removeStaff(id: string) {
    await supabase.from("staff").update({ active: false }).eq("id", id);
    router.refresh();
  }

  async function saveCode(e: React.FormEvent) {
    e.preventDefault();
    setSavingCode(true);
    await supabase.from("app_settings").update({ value: code }).eq("key", "staff_invite_code");
    setSavingCode(false);
  }

  return (
    <div>
      <div className="mb-8 border border-line rounded-xl p-5">
        <p className="tracked-caps text-charcoal-soft mb-2">Staff Invite Code</p>
        <p className="text-sm text-charcoal-soft/80 mb-3">
          Give this code to new hires — they'll enter it at <strong>/staff/join</strong> to create
          their account.
        </p>
        <form onSubmit={saveCode} className="flex gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 border border-line rounded-lg px-3 py-2 font-mono"
          />
          <button
            disabled={savingCode}
            className="tracked-caps bg-sage-deep text-cream px-5 py-2.5 rounded-full hover:bg-[#324a2c] disabled:opacity-60"
          >
            Save
          </button>
        </form>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <p className="tracked-caps text-charcoal-soft mb-3">Pending Approval ({pending.length})</p>
          <div className="space-y-2">
            {pending.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between border border-gold-light bg-sage-tint/40 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="font-display text-sage-deep">{s.full_name}</p>
                  <p className="text-sm text-charcoal-soft">
                    {s.phone} {s.email ? `· ${s.email}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => approve(s.id)}
                  className="tracked-caps text-xs bg-sage-deep text-cream px-4 py-2 rounded-full hover:bg-[#324a2c]"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="tracked-caps text-charcoal-soft mb-3">Active Staff ({active.length})</p>
        <div className="space-y-2">
          {active.length === 0 && <p className="text-charcoal-soft text-sm">No active staff yet.</p>}
          {active.map((s) => (
            <div key={s.id} className="flex items-center justify-between border border-line rounded-lg px-4 py-3">
              <div>
                <p className="font-display text-sage-deep">{s.full_name}</p>
                <p className="text-sm text-charcoal-soft">
                  {s.phone} {s.email ? `· ${s.email}` : ""}
                </p>
              </div>
              <button
                onClick={() => removeStaff(s.id)}
                className="tracked-caps text-xs border border-line text-red-700 px-4 py-2 rounded-full hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

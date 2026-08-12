"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function BlockDateForm() {
  const supabase = createClient();
  const router = useRouter();
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    setSubmitting(true);
    await supabase.from("blocked_dates").insert({ date, reason: reason || null });
    setSubmitting(false);
    setDate("");
    setReason("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="tracked-caps text-xs text-charcoal-soft block mb-1">Date to block</label>
        <input
          required
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-line rounded-lg px-3 py-2"
        />
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="tracked-caps text-xs text-charcoal-soft block mb-1">Reason (optional)</label>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-line rounded-lg px-3 py-2"
          placeholder="Holiday, day off…"
        />
      </div>
      <button
        disabled={submitting}
        className="tracked-caps bg-sage-deep text-cream px-5 py-2.5 rounded-full hover:bg-[#324a2c] disabled:opacity-60"
      >
        Block
      </button>
    </form>
  );
}

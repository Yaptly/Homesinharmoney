"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const TZ = "America/New_York";

type Booking = {
  id: string;
  start_time: string;
  status: string;
  recurrence: string;
  notes: string | null;
  address_line1: string | null;
  city: string | null;
  assigned_staff_id: string | null;
  quoted_price_cents: number | null;
  lead_source: string | null;
  clients: { full_name: string; phone: string; email: string | null } | null;
  services: { name: string } | null;
};

type StaffOption = { id: string; full_name: string };

const statusStyles: Record<string, string> = {
  requested: "bg-gold-light text-charcoal",
  confirmed: "bg-sage-tint text-sage-deep",
  completed: "bg-line text-charcoal-soft",
  cancelled: "bg-red-100 text-red-700",
};

export function BookingRow({ booking, staffOptions }: { booking: Booking; staffOptions: StaffOption[] }) {
  const supabase = createClient();
  const [status, setStatus] = useState(booking.status);
  const [assignedStaffId, setAssignedStaffId] = useState(booking.assigned_staff_id);
  const [updating, setUpdating] = useState(false);

  async function updateStatus(next: string) {
    setUpdating(true);
    const { error } = await supabase.from("bookings").update({ status: next }).eq("id", booking.id);
    if (!error) setStatus(next);
    setUpdating(false);
  }

  async function updateAssignment(staffId: string) {
    setUpdating(true);
    const { error } = await supabase
      .from("bookings")
      .update({ assigned_staff_id: staffId || null })
      .eq("id", booking.id);
    if (!error) setAssignedStaffId(staffId || null);
    setUpdating(false);
  }

  return (
    <div className="border border-line rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <p className="text-charcoal-soft mt-1">
          {booking.services?.name} — {booking.clients?.full_name}
          {booking.quoted_price_cents != null && (
            <span className="text-gold"> · ${(booking.quoted_price_cents / 100).toFixed(0)}</span>
          )}
        </p>
        <p className="text-sm text-charcoal-soft/80">
          {booking.clients?.phone}
          {booking.clients?.email ? ` · ${booking.clients.email}` : ""}
        </p>
        {booking.address_line1 && (
          <p className="text-sm text-charcoal-soft/80">
            {booking.address_line1}, {booking.city}
          </p>
        )}
        {booking.recurrence !== "none" && (
          <p className="tracked-caps text-xs text-gold mt-1">{booking.recurrence}</p>
        )}
        {booking.lead_source && booking.lead_source !== "website" && (
          <p className="tracked-caps text-xs text-charcoal-soft/60 mt-1">via {booking.lead_source.replace("_", " ")}</p>
        )}
        {booking.notes && <p className="text-sm italic text-charcoal-soft/80 mt-1">"{booking.notes}"</p>}
        <select
          value={assignedStaffId ?? ""}
          onChange={(e) => updateAssignment(e.target.value)}
          disabled={updating}
          className="mt-2 text-sm border border-line rounded-lg px-2 py-1.5"
        >
          <option value="">Unassigned</option>
          {staffOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={`tracked-caps text-xs px-3 py-1.5 rounded-full ${statusStyles[status]}`}>
          {status}
        </span>
        <div className="flex gap-2">
          {status !== "confirmed" && status !== "completed" && (
            <button
              disabled={updating}
              onClick={() => updateStatus("confirmed")}
              className="text-xs tracked-caps border border-sage-deep text-sage-deep px-3 py-1.5 rounded-full hover:bg-sage-tint"
            >
              Confirm
            </button>
          )}
          {status !== "completed" && (
            <button
              disabled={updating}
              onClick={() => updateStatus("completed")}
              className="text-xs tracked-caps border border-line text-charcoal-soft px-3 py-1.5 rounded-full hover:bg-sage-tint"
            >
              Complete
            </button>
          )}
          {status !== "cancelled" && (
            <button
              disabled={updating}
              onClick={() => updateStatus("cancelled")}
              className="text-xs tracked-caps border border-line text-red-700 px-3 py-1.5 rounded-full hover:bg-red-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

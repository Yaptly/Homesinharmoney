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
  clients: { full_name: string; phone: string; email: string | null } | null;
  services: { name: string } | null;
};

const statusStyles: Record<string, string> = {
  requested: "bg-gold-light text-charcoal",
  confirmed: "bg-sage-tint text-sage-deep",
  completed: "bg-line text-charcoal-soft",
  cancelled: "bg-red-100 text-red-700",
};

export function BookingRow({ booking }: { booking: Booking }) {
  const supabase = createClient();
  const [status, setStatus] = useState(booking.status);
  const [updating, setUpdating] = useState(false);

  async function updateStatus(next: string) {
    setUpdating(true);
    const { error } = await supabase.from("bookings").update({ status: next }).eq("id", booking.id);
    if (!error) setStatus(next);
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
        {booking.notes && <p className="text-sm italic text-charcoal-soft/80 mt-1">"{booking.notes}"</p>}
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

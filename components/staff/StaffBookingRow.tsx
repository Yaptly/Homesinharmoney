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
  address_line2: string | null;
  city: string | null;
  clients: { full_name: string; phone: string } | null;
  services: { name: string } | null;
};

export function StaffBookingRow({ booking }: { booking: Booking }) {
  const supabase = createClient();
  const [status, setStatus] = useState(booking.status);
  const [updating, setUpdating] = useState(false);

  async function markComplete() {
    setUpdating(true);
    const { error } = await supabase.rpc("staff_update_booking_status", {
      p_booking_id: booking.id,
      p_status: "completed",
    });
    if (!error) setStatus("completed");
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
        <p className="text-charcoal-soft mt-1">{booking.services?.name}</p>
        <p className="text-sm text-charcoal-soft/80">
          {booking.address_line1}
          {booking.address_line2 ? `, ${booking.address_line2}` : ""}, {booking.city}
        </p>
        <p className="text-sm text-charcoal-soft/80">
          {booking.clients?.full_name} · {booking.clients?.phone}
        </p>
        {booking.notes && <p className="text-sm italic text-charcoal-soft/80 mt-1">"{booking.notes}"</p>}
      </div>
      <div className="shrink-0">
        {status === "completed" ? (
          <span className="tracked-caps text-xs bg-sage-tint text-sage-deep px-3 py-1.5 rounded-full">
            Completed
          </span>
        ) : (
          <button
            disabled={updating}
            onClick={markComplete}
            className="tracked-caps text-xs border border-sage-deep text-sage-deep px-4 py-2 rounded-full hover:bg-sage-tint"
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}

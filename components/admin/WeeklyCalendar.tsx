"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const TZ = "America/New_York";
const DAY = 86_400_000;

type CalendarBooking = {
  id: string;
  start_time: string;
  status: string;
  assigned_staff_id: string | null;
  address_line1: string | null;
  clients: { full_name: string } | null;
  services: { name: string; duration_minutes: number } | null;
};

type StaffOption = { id: string; full_name: string };

function localDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const weekday = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" })
      .formatToParts(copy)
      .find((part) => part.type === "weekday")?.value
      .replace("Sun", "0")
      .replace("Mon", "1")
      .replace("Tue", "2")
      .replace("Wed", "3")
      .replace("Thu", "4")
      .replace("Fri", "5")
      .replace("Sat", "6")
  );
  copy.setHours(12, 0, 0, 0);
  copy.setTime(copy.getTime() - (Number.isFinite(weekday) ? weekday : 0) * DAY);
  return copy;
}

export function WeeklyCalendar({
  bookings,
  staff,
}: {
  bookings: CalendarBooking[];
  staff: StaffOption[];
}) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [staffId, setStaffId] = useState("");

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, index) => new Date(weekStart.getTime() + index * DAY)),
    [weekStart]
  );

  const visible = staffId
    ? bookings.filter((booking) => booking.assigned_staff_id === staffId)
    : bookings;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekStart(new Date(weekStart.getTime() - 7 * DAY))}
            className="border border-line rounded-full px-4 py-2 text-sm hover:bg-sage-tint"
            aria-label="Previous week"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setWeekStart(startOfWeek(new Date()))}
            className="border border-line rounded-full px-4 py-2 text-sm hover:bg-sage-tint"
          >
            This week
          </button>
          <button
            type="button"
            onClick={() => setWeekStart(new Date(weekStart.getTime() + 7 * DAY))}
            className="border border-line rounded-full px-4 py-2 text-sm hover:bg-sage-tint"
            aria-label="Next week"
          >
            →
          </button>
        </div>
        <select
          value={staffId}
          onChange={(event) => setStaffId(event.target.value)}
          className="border border-line rounded-lg px-3 py-2 bg-cream"
          aria-label="Filter by staff member"
        >
          <option value="">All staff</option>
          {staff.map((member) => (
            <option key={member.id} value={member.id}>{member.full_name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {days.map((day) => {
          const key = localDateKey(day);
          const dayBookings = visible.filter((booking) => localDateKey(new Date(booking.start_time)) === key);
          const isToday = key === localDateKey(new Date());

          return (
            <section
              key={key}
              className={`border rounded-xl min-h-36 p-3 ${isToday ? "border-sage-deep bg-sage-tint/30" : "border-line"}`}
            >
              <div className="mb-3">
                <p className="tracked-caps text-xs text-charcoal-soft">
                  {day.toLocaleDateString("en-US", { weekday: "short", timeZone: TZ })}
                </p>
                <p className="font-display text-xl text-sage-deep">
                  {day.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TZ })}
                </p>
              </div>
              <div className="space-y-2">
                {dayBookings.length === 0 ? (
                  <p className="text-xs text-charcoal-soft/60">No bookings</p>
                ) : (
                  dayBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/admin/bookings?booking=${booking.id}`}
                      className="block border border-line bg-cream rounded-lg p-2 hover:border-sage-deep transition-colors"
                    >
                      <p className="font-medium text-sm text-sage-deep">
                        {new Date(booking.start_time).toLocaleTimeString("en-US", {
                          timeZone: TZ,
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-charcoal-soft mt-1 line-clamp-2">
                        {booking.clients?.full_name ?? "Client"} · {booking.services?.name ?? "Cleaning"}
                      </p>
                      <span className="inline-block mt-2 tracked-caps text-[10px] text-charcoal-soft">
                        {booking.status}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

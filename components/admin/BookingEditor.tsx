"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TZ = "America/New_York";

type Booking = {
  id: string;
  service_id: string;
  start_time: string;
  status: string;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  zip: string | null;
  notes: string | null;
  assigned_staff_id: string | null;
  quoted_price_cents: number | null;
  clients: { full_name: string; phone: string; email: string | null } | null;
  services: { name: string } | null;
};

type Option = { id: string; name?: string; full_name?: string };

function datePart(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function timePart(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function BookingEditor({
  booking,
  services,
  staff,
  initiallyOpen = false,
}: {
  booking: Booking;
  services: Option[];
  staff: Option[];
  initiallyOpen?: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(initiallyOpen);
  const [saving, setSaving] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    serviceId: booking.service_id,
    date: datePart(booking.start_time),
    time: timePart(booking.start_time),
    status: booking.status,
    assignedStaffId: booking.assigned_staff_id ?? "",
    address1: booking.address_line1 ?? "",
    address2: booking.address_line2 ?? "",
    city: booking.city ?? "",
    zip: booking.zip ?? "",
    notes: booking.notes ?? "",
    price: booking.quoted_price_cents == null ? "" : (booking.quoted_price_cents / 100).toFixed(2),
  });

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    const startTime = new Date(`${form.date}T${form.time}:00`);
    if (Number.isNaN(startTime.getTime())) {
      setSaving(false);
      setError("Choose a valid date and time.");
      return;
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        service_id: form.serviceId,
        start_time: startTime.toISOString(),
        status: form.status,
        assigned_staff_id: form.assignedStaffId || null,
        address_line1: form.address1.trim() || null,
        address_line2: form.address2.trim() || null,
        city: form.city.trim() || null,
        zip: form.zip.trim() || null,
        notes: form.notes.trim() || null,
        quoted_price_cents: form.price ? Math.round(Number(form.price) * 100) : null,
      })
      .eq("id", booking.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage("Booking updated.");
    setOpen(false);
    router.refresh();
  }

  async function cancelBooking() {
    setSaving(true);
    setError(null);
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", booking.id);
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setConfirmCancel(false);
    setMessage("Booking cancelled.");
    router.refresh();
  }

  return (
    <article className="border border-line rounded-xl p-5 bg-cream">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <p className="font-display text-xl text-sage-deep">
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
            {booking.services?.name ?? "Cleaning"} — {booking.clients?.full_name ?? "Client"}
          </p>
          <p className="text-sm text-charcoal-soft/80 mt-1">
            {booking.address_line1}{booking.city ? `, ${booking.city}` : ""}
          </p>
          <p className="tracked-caps text-xs text-gold mt-2">{booking.status}</p>
          {message ? <p className="text-sm text-sage-deep mt-2" role="status">{message}</p> : null}
          {error ? <p className="text-sm text-red-700 mt-2" role="alert">{error}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="tracked-caps text-xs border border-sage-deep text-sage-deep rounded-full px-4 py-2 hover:bg-sage-tint"
        >
          {open ? "Close" : "Edit"}
        </button>
      </div>

      {open ? (
        <form onSubmit={save} className="mt-6 pt-6 border-t border-line space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Service</span>
              <select value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 bg-cream">
                {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Assigned staff</span>
              <select value={form.assignedStaffId} onChange={(e) => setForm({ ...form, assignedStaffId: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 bg-cream">
                <option value="">Unassigned</option>
                {staff.map((member) => <option key={member.id} value={member.id}>{member.full_name}</option>)}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label className="block">
              <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Date</span>
              <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2" />
            </label>
            <label className="block">
              <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Time</span>
              <input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2" />
            </label>
            <label className="block col-span-2 md:col-span-1">
              <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 bg-cream">
                <option value="requested">Requested</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Address</span>
            <input value={form.address1} onChange={(e) => setForm({ ...form, address1: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2" />
          </label>
          <div className="grid md:grid-cols-3 gap-4">
            <input aria-label="Apartment or unit" placeholder="Apt / unit" value={form.address2} onChange={(e) => setForm({ ...form, address2: e.target.value })} className="border border-line rounded-lg px-3 py-2" />
            <input aria-label="City" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="border border-line rounded-lg px-3 py-2" />
            <input aria-label="ZIP code" placeholder="ZIP" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="border border-line rounded-lg px-3 py-2" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <label className="block">
              <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Price</span>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2" />
            </label>
            <label className="block md:col-span-2">
              <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Job notes</span>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 min-h-20" />
            </label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            {!confirmCancel ? (
              <button type="button" onClick={() => setConfirmCancel(true)} className="tracked-caps text-xs text-red-700 px-4 py-2">
                Cancel booking
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-red-700">Are you sure?</span>
                <button type="button" disabled={saving} onClick={cancelBooking} className="tracked-caps text-xs bg-red-700 text-white rounded-full px-4 py-2">Yes, cancel</button>
                <button type="button" onClick={() => setConfirmCancel(false)} className="text-sm text-charcoal-soft">Keep it</button>
              </div>
            )}
            <button disabled={saving} className="tracked-caps bg-sage-deep text-cream rounded-full px-6 py-3 disabled:opacity-60">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      ) : null}
    </article>
  );
}

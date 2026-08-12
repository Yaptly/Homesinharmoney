"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  base_price_cents: number | null;
};
type StaffOption = { id: string; full_name: string };

const TZ = "America/New_York";

export function AdminNewBookingForm({
  services,
  staffOptions,
}: {
  services: Service[];
  staffOptions: StaffOption[];
}) {
  const supabase = createClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    serviceId: services[0]?.id ?? "",
    date: "",
    time: "",
    fullName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    zip: "",
    notes: "",
    status: "confirmed",
    assignedStaffId: "",
    price: "",
    leadSource: "manual",
  });

  function reset() {
    setForm({
      serviceId: services[0]?.id ?? "",
      date: "",
      time: "",
      fullName: "",
      phone: "",
      email: "",
      address1: "",
      address2: "",
      zip: "",
      notes: "",
      status: "confirmed",
      assignedStaffId: "",
      price: "",
      leadSource: "manual",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.time) {
      setError("Pick a date and time.");
      return;
    }
    setSubmitting(true);
    setError(null);

    // build a timestamp in America/New_York from the plain date+time inputs
    const startTime = new Date(`${form.date}T${form.time}:00`);

    const { error: rpcError } = await supabase.rpc("admin_create_booking", {
      p_service_id: form.serviceId,
      p_start_time: startTime.toISOString(),
      p_full_name: form.fullName,
      p_phone: form.phone,
      p_email: form.email || null,
      p_address_line1: form.address1,
      p_address_line2: form.address2 || null,
      p_zip: form.zip,
      p_notes: form.notes || null,
      p_status: form.status,
      p_assigned_staff_id: form.assignedStaffId || null,
      p_quoted_price_cents: form.price ? Math.round(parseFloat(form.price) * 100) : null,
      p_lead_source: form.leadSource,
    });

    setSubmitting(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    reset();
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="tracked-caps bg-sage-deep text-cream px-5 py-2.5 rounded-full hover:bg-[#324a2c]"
      >
        + New Booking
      </button>
    );
  }

  return (
    <div className="border border-line rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display text-lg text-sage-deep">New Booking (phone / walk-in / existing client)</p>
        <button onClick={() => setOpen(false)} className="text-charcoal-soft text-sm">
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.serviceId}
            onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
            className="border border-line rounded-lg px-3 py-2"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-line rounded-lg px-3 py-2"
          >
            <option value="confirmed">Confirmed</option>
            <option value="requested">Requested</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border border-line rounded-lg px-3 py-2"
          />
          <input
            required
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="border border-line rounded-lg px-3 py-2"
          />
        </div>
        <p className="text-xs text-charcoal-soft/70">Time is in {TZ.replace("_", " ")}.</p>

        <input
          required
          placeholder="Client full name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="w-full border border-line rounded-lg px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            required
            type="tel"
            placeholder="Phone (used to match existing clients)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border border-line rounded-lg px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-line rounded-lg px-3 py-2"
          />
        </div>
        <input
          required
          placeholder="Address"
          value={form.address1}
          onChange={(e) => setForm({ ...form, address1: e.target.value })}
          className="w-full border border-line rounded-lg px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Apt / Unit (optional)"
            value={form.address2}
            onChange={(e) => setForm({ ...form, address2: e.target.value })}
            className="border border-line rounded-lg px-3 py-2"
          />
          <input
            required
            placeholder="ZIP code"
            value={form.zip}
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
            className="border border-line rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={form.assignedStaffId}
            onChange={(e) => setForm({ ...form, assignedStaffId: e.target.value })}
            className="border border-line rounded-lg px-3 py-2"
          >
            <option value="">Unassigned</option>
            {staffOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Price ($, optional — defaults to service price)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border border-line rounded-lg px-3 py-2"
          />
        </div>

        <select
          value={form.leadSource}
          onChange={(e) => setForm({ ...form, leadSource: e.target.value })}
          className="w-full border border-line rounded-lg px-3 py-2"
        >
          <option value="manual">Manual entry (unspecified)</option>
          <option value="phone">Phone call</option>
          <option value="repeat_customer">Repeat customer</option>
          <option value="referral">Referral</option>
          <option value="walk_in">Walk-in</option>
          <option value="google">Google (told her directly)</option>
          <option value="facebook">Facebook</option>
          <option value="other">Other</option>
        </select>

        <textarea
          placeholder="Notes (pets, gate code, parking, etc.)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full border border-line rounded-lg px-3 py-2 min-h-[70px]"
        />

        {error && <p className="text-red-700 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full tracked-caps bg-sage-deep text-cream px-6 py-3 rounded-full hover:bg-[#324a2c] disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create Booking"}
        </button>
      </form>
    </div>
  );
}

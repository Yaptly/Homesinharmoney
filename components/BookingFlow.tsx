"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  base_price_cents: number | null;
};

type Recurrence = "none" | "weekly" | "biweekly" | "monthly";

const TZ = "America/New_York";

function nextNDays(n: number) {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function dateKey(d: Date) {
  return d.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
}

export function BookingFlow({ services }: { services: Service[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [recurrence, setRecurrence] = useState<Recurrence>("none");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    zip: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedCount, setConfirmedCount] = useState<number | null>(null);

  const days = useMemo(() => nextNDays(21), []);

  useEffect(() => {
    if (!selectedService || !selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    setError(null);
    supabase
      .rpc("get_available_slots", {
        p_date: dateKey(selectedDate),
        p_service_id: selectedService.id,
      })
      .then(({ data, error }) => {
        if (error) {
          setError("Couldn't load available times. Please try again.");
          setSlots([]);
        } else {
          setSlots((data ?? []).map((row: { slot_start: string }) => row.slot_start));
        }
        setLoadingSlots(false);
      });
  }, [selectedService, selectedDate, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService || !selectedSlot) return;
    setSubmitting(true);
    setError(null);

    const { data, error } = await supabase.rpc("create_booking", {
      p_service_id: selectedService.id,
      p_start_time: selectedSlot,
      p_full_name: form.fullName,
      p_phone: form.phone,
      p_email: form.email || null,
      p_address_line1: form.address1,
      p_address_line2: form.address2 || null,
      p_zip: form.zip,
      p_notes: form.notes || null,
      p_recurrence: recurrence,
    });

    setSubmitting(false);

    if (error) {
      setError(error.message.includes("just booked")
        ? "That time was just booked by someone else — please pick another."
        : "Something went wrong submitting your booking. Please try again or call/text 304-491-5175.");
      return;
    }

    if (!data) {
      setError("Something went wrong submitting your booking. Please call/text 304-491-5175.");
      return;
    }

    const counts: Record<Recurrence, number> = { none: 1, weekly: 12, biweekly: 8, monthly: 6 };
    setConfirmedCount(counts[recurrence]);
    setStep(5);

    // fire-and-forget owner notification — booking is already saved either way
    supabase.functions
      .invoke("notify-owner", {
        body: {
          type: "booking",
          full_name: form.fullName,
          phone: form.phone,
          email: form.email,
          service_name: selectedService.name,
          start_time: new Date(selectedSlot).toLocaleString("en-US", {
            timeZone: TZ,
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
          recurrence,
          address: `${form.address1}${form.address2 ? ", " + form.address2 : ""}, ${form.zip}`,
          notes: form.notes,
        },
      })
      .catch(() => {
        // booking already saved; email is best-effort
      });
  }

  if (step === 5) {
    return (
      <div className="text-center py-16">
        <p className="tracked-caps text-gold mb-3">Request Received</p>
        <h2 className="font-display text-3xl text-sage-deep mb-4">Thank you, {form.fullName.split(" ")[0]}.</h2>
        <p className="text-charcoal-soft max-w-md mx-auto leading-relaxed">
          Your cleaning{confirmedCount && confirmedCount > 1 ? ` (and ${confirmedCount - 1} recurring visit${confirmedCount - 1 > 1 ? "s" : ""})` : ""} has
          been requested for{" "}
          <strong>
            {selectedSlot &&
              new Date(selectedSlot).toLocaleString("en-US", {
                timeZone: TZ,
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
          </strong>
          . Basima will confirm shortly by phone or text at {form.phone}.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1.5 w-10 rounded-full ${step >= n ? "bg-sage-deep" : "bg-line"}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="font-display text-2xl text-sage-deep mb-6 text-center">Choose a service</h2>
          <div className="space-y-3">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedService(s);
                  setStep(2);
                }}
                className="w-full text-left border border-line rounded-xl p-5 hover:border-sage-deep hover:bg-sage-tint transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-display text-lg text-sage-deep">{s.name}</p>
                    <p className="text-sm text-charcoal-soft mt-1">{s.description}</p>
                  </div>
                  <p className="text-gold font-display shrink-0">
                    {s.base_price_cents ? `$${(s.base_price_cents / 100).toFixed(0)}` : "Quote"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedService && (
        <div>
          <button onClick={() => setStep(1)} className="tracked-caps text-charcoal-soft mb-6">
            ← Back
          </button>
          <h2 className="font-display text-2xl text-sage-deep mb-6 text-center">Choose a date</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {days.map((d) => {
              const isSelected = selectedDate && dateKey(selectedDate) === dateKey(d);
              return (
                <button
                  key={dateKey(d)}
                  onClick={() => {
                    setSelectedDate(d);
                    setStep(3);
                  }}
                  className={`border rounded-lg py-3 px-2 text-center transition-colors ${
                    isSelected
                      ? "bg-sage-deep text-cream border-sage-deep"
                      : "border-line hover:border-sage-deep"
                  }`}
                >
                  <p className="tracked-caps text-xs opacity-70">
                    {d.toLocaleDateString("en-US", { timeZone: TZ, weekday: "short" })}
                  </p>
                  <p className="font-display text-lg">
                    {d.toLocaleDateString("en-US", { timeZone: TZ, month: "short", day: "numeric" })}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 3 && selectedService && selectedDate && (
        <div>
          <button onClick={() => setStep(2)} className="tracked-caps text-charcoal-soft mb-6">
            ← Back
          </button>
          <h2 className="font-display text-2xl text-sage-deep mb-2 text-center">Choose a time</h2>
          <p className="text-center text-charcoal-soft mb-6">
            {selectedDate.toLocaleDateString("en-US", {
              timeZone: TZ,
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          {loadingSlots && <p className="text-center text-charcoal-soft">Loading times…</p>}
          {!loadingSlots && slots.length === 0 && (
            <p className="text-center text-charcoal-soft">
              No openings this day. Please choose another date.
            </p>
          )}
          <div className="grid grid-cols-3 gap-3">
            {slots.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSelectedSlot(s);
                  setStep(4);
                }}
                className="border border-line rounded-lg py-3 text-center hover:border-sage-deep hover:bg-sage-tint transition-colors font-display text-sage-deep"
              >
                {new Date(s).toLocaleTimeString("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" })}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && selectedService && selectedSlot && (
        <form onSubmit={handleSubmit}>
          <button type="button" onClick={() => setStep(3)} className="tracked-caps text-charcoal-soft mb-6">
            ← Back
          </button>
          <h2 className="font-display text-2xl text-sage-deep mb-2 text-center">Your details</h2>
          <p className="text-center text-charcoal-soft mb-8">
            {selectedService.name} —{" "}
            {new Date(selectedSlot).toLocaleString("en-US", {
              timeZone: TZ,
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>

          <div className="space-y-4">
            <input
              required
              placeholder="Full name"
              className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              required
              type="tel"
              placeholder="Phone"
              className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              required
              placeholder="Address"
              className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
              value={form.address1}
              onChange={(e) => setForm({ ...form, address1: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Apt / Unit (optional)"
                className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
                value={form.address2}
                onChange={(e) => setForm({ ...form, address2: e.target.value })}
              />
              <input
                required
                placeholder="ZIP code"
                className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Anything we should know? (pets, gate code, parking, etc.)"
              className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none min-h-[90px]"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div>
              <label className="tracked-caps text-charcoal-soft block mb-2">Repeat this cleaning?</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  ["none", "One time"],
                  ["weekly", "Weekly"],
                  ["biweekly", "Every 2 weeks"],
                  ["monthly", "Monthly"],
                ] as [Recurrence, string][]).map(([val, label]) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setRecurrence(val)}
                    className={`border rounded-lg py-2.5 text-sm transition-colors ${
                      recurrence === val
                        ? "bg-sage-deep text-cream border-sage-deep"
                        : "border-line hover:border-sage-deep"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-red-700 text-sm mt-4">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-8 tracked-caps bg-sage-deep text-cream px-8 py-4 rounded-full hover:bg-[#324a2c] transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Request Booking"}
          </button>
        </form>
      )}
    </div>
  );
}

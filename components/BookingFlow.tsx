"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  House,
  PackageOpen,
  Phone,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  base_price_cents: number | null;
};

type Recurrence = "none" | "weekly" | "biweekly" | "monthly";
type Intake = {
  homeSize: string;
  bedrooms: string;
  bathrooms: string;
  condition: string;
};
type Contact = {
  fullName: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
  notes: string;
};

const TZ = "America/New_York";
const PHONE_DISPLAY = "304-491-5175";
const PHONE_HREF = "tel:+13044915175";

const cityOptions = [
  "Morgantown",
  "Fairmont",
  "Clarksburg",
  "Westover",
  "Star City",
  "Granville",
  "Brookhaven",
  "Cheat Lake",
  "Suncrest",
];

const frequencies: Array<{ value: Recurrence; label: string; detail: string }> = [
  { value: "none", label: "One time", detail: "One visit" },
  { value: "weekly", label: "Weekly", detail: "Preference only" },
  { value: "biweekly", label: "Every 2 weeks", detail: "Preference only" },
  { value: "monthly", label: "Monthly", detail: "Preference only" },
];

function nextNDays(count: number) {
  const result: Date[] = [];
  const today = new Date();
  for (let index = 0; index < count; index += 1) {
    const day = new Date(today);
    day.setDate(today.getDate() + index);
    day.setHours(12, 0, 0, 0);
    result.push(day);
  }
  return result;
}

function dateKey(date: Date) {
  return date.toLocaleDateString("en-CA", { timeZone: TZ });
}

function money(cents: number | null) {
  return cents == null ? "Custom quote" : `Starting at $${(cents / 100).toFixed(0)}`;
}

function ServiceIcon({ name, className = "w-7 h-7" }: { name: string; className?: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("deep")) return <Sparkles className={className} strokeWidth={1.5} aria-hidden="true" />;
  if (lower.includes("move")) return <PackageOpen className={className} strokeWidth={1.5} aria-hidden="true" />;
  if (lower.includes("commercial")) return <Building2 className={className} strokeWidth={1.5} aria-hidden="true" />;
  return <House className={className} strokeWidth={1.5} aria-hidden="true" />;
}

function serviceSubtitle(service: Service) {
  const lower = service.name.toLowerCase();
  if (lower.includes("standard")) return "Routine upkeep for an already maintained home";
  if (lower.includes("deep")) return "A detailed reset, ideal for a first visit";
  if (lower.includes("move")) return "For an empty home before or after moving";
  if (lower.includes("commercial")) return "Custom scope and quote";
  return service.description ?? "Professional cleaning tailored to your space";
}

export function BookingFlow({ services }: { services: Service[] }) {
  const supabase = useMemo(() => createClient(), []);
  const days = useMemo(() => nextNDays(14), []);

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [intake, setIntake] = useState<Intake>({
    homeSize: "",
    bedrooms: "",
    bathrooms: "",
    condition: "",
  });
  const [recurrence, setRecurrence] = useState<Recurrence>("none");
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [contact, setContact] = useState<Contact>({
    fullName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "Morgantown",
    zip: "",
    notes: "",
  });
  const [consultationType, setConsultationType] = useState<"help" | "commercial" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState<"booking" | "consultation" | null>(null);

  useEffect(() => {
    if (step !== 3 || !selectedService) return;

    let cancelled = false;
    setLoadingAvailability(true);
    setError(null);

    Promise.all(
      days.map(async (day) => {
        const key = dateKey(day);
        const { data, error: slotError } = await supabase.rpc("get_available_slots", {
          p_date: key,
          p_service_id: selectedService.id,
        });
        if (slotError) throw slotError;
        const allSlots = (data ?? []).map((row: { slot_start: string }) => row.slot_start);
        const hourlySlots = allSlots.filter((slot: string) => new Date(slot).getMinutes() === 0);
        return [key, hourlySlots.length > 0 ? hourlySlots : allSlots] as const;
      })
    )
      .then((entries) => {
        if (cancelled) return;
        const nextAvailability = Object.fromEntries(entries);
        setAvailability(nextAvailability);
        const firstAvailable = entries.find(([, slots]) => slots.length > 0)?.[0] ?? "";
        setSelectedDateKey((current) => current || firstAvailable);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load availability. Please try again or call/text Basima.");
      })
      .finally(() => {
        if (!cancelled) setLoadingAvailability(false);
      });

    return () => {
      cancelled = true;
    };
  }, [days, selectedService, step, supabase]);

  function chooseService(service: Service) {
    setSelectedService(service);
    setError(null);
    if (service.name.toLowerCase().includes("commercial")) {
      setConsultationType("commercial");
      return;
    }
    setConsultationType(null);
    setStep(2);
  }

  function continueToSchedule() {
    if (!intake.homeSize || !intake.bedrooms || !intake.bathrooms || !intake.condition) {
      setError("Tell us a little about your home so we can provide an accurate starting estimate.");
      return;
    }
    setError(null);
    setStep(3);
  }

  async function submitConsultation(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const heading = consultationType === "commercial" ? "Commercial cleaning quote request" : "Help choosing a cleaning";
    const message = [
      heading,
      `Preferred city: ${contact.city}`,
      contact.notes ? `Message: ${contact.notes}` : "Please call to discuss cleaning needs.",
    ].join("\n");

    const { error: insertError } = await supabase.from("contact_inquiries").insert({
      full_name: contact.fullName.trim(),
      phone: contact.phone.trim(),
      email: contact.email.trim() || null,
      message,
    });

    setSubmitting(false);
    if (insertError) {
      setError("We couldn't send your request. Please call or text Basima instead.");
      return;
    }

    setComplete("consultation");
    supabase.functions.invoke("notify-owner", {
      body: {
        type: "contact",
        full_name: contact.fullName,
        phone: contact.phone,
        email: contact.email,
        message,
      },
    }).catch(() => undefined);
  }

  async function submitBooking(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedService || !selectedSlot) return;

    setSubmitting(true);
    setError(null);
    const { data, error: bookingError } = await supabase.rpc("create_booking_v2", {
      p_service_id: selectedService.id,
      p_start_time: selectedSlot,
      p_full_name: contact.fullName,
      p_phone: contact.phone,
      p_email: contact.email || null,
      p_address_line1: contact.address1,
      p_address_line2: contact.address2 || null,
      p_city: contact.city,
      p_zip: contact.zip,
      p_notes: contact.notes || null,
      p_recurrence: recurrence,
      p_intake: {
        home_size: intake.homeSize,
        bedrooms: intake.bedrooms,
        bathrooms: intake.bathrooms,
        condition: intake.condition,
      },
    });

    setSubmitting(false);
    if (bookingError || !data) {
      setError(
        bookingError?.message.includes("just booked")
          ? "That time was just booked. Please choose another available time."
          : bookingError?.message || "We couldn't submit your request. Please call or text Basima."
      );
      return;
    }

    setComplete("booking");
    supabase.functions.invoke("notify-owner", {
      body: {
        type: "booking",
        full_name: contact.fullName,
        phone: contact.phone,
        email: contact.email,
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
        address: `${contact.address1}${contact.address2 ? ", " + contact.address2 : ""}, ${contact.city}, WV ${contact.zip}`,
        notes: `${contact.notes}\nHome: ${intake.homeSize}, ${intake.bedrooms} bedrooms, ${intake.bathrooms} bathrooms, ${intake.condition}`,
      },
    }).catch(() => undefined);
  }

  if (complete) {
    return (
      <div className="text-center py-14 sm:py-16 border border-line rounded-2xl px-6">
        <p className="tracked-caps text-gold mb-3">
          {complete === "booking" ? "Request Received" : "We'll Help You Choose"}
        </p>
        <h2 className="font-display text-3xl text-sage-deep mb-4">
          Thank you{contact.fullName ? `, ${contact.fullName.split(" ")[0]}` : ""}.
        </h2>
        <p className="text-charcoal-soft max-w-md mx-auto leading-relaxed">
          {complete === "booking"
            ? "Basima will review your home details, confirm the final price, and confirm your requested appointment by phone or text."
            : "Basima will call or text you to talk through your space, recommend the right cleaning, and provide a clear estimate."}
        </p>
        <a href={PHONE_HREF} className="inline-block mt-7 tracked-caps text-sage-deep underline underline-offset-4">
          Call or text {PHONE_DISPLAY}
        </a>
      </div>
    );
  }

  if (consultationType) {
    return (
      <ConsultationForm
        type={consultationType}
        contact={contact}
        setContact={setContact}
        submitting={submitting}
        error={error}
        onBack={() => {
          setConsultationType(null);
          setError(null);
        }}
        onSubmit={submitConsultation}
      />
    );
  }

  const selectedDate = days.find((day) => dateKey(day) === selectedDateKey);
  const selectedSlots = selectedDateKey ? availability[selectedDateKey] ?? [] : [];
  const frequency = frequencies.find((item) => item.value === recurrence);
  const canContinueHome = Boolean(intake.homeSize && intake.bedrooms && intake.bathrooms && intake.condition);

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-8" aria-label={`Step ${step} of 4`}>
        {[1, 2, 3, 4].map((number) => (
          <div key={number} className={`h-1.5 w-10 rounded-full ${step >= number ? "bg-sage-deep" : "bg-line"}`} />
        ))}
      </div>

      {step === 1 ? (
        <section>
          <h2 className="font-display text-3xl sm:text-4xl text-sage-deep text-center">What can we help with?</h2>
          <p className="text-center text-charcoal-soft mt-3 mb-7">Choose a service, or let us help you decide.</p>
          <div className="space-y-3">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => chooseService(service)}
                className="w-full text-left border border-line rounded-xl px-4 py-4 flex items-center justify-between gap-4 hover:border-sage-deep hover:bg-sage-tint/30 transition-colors"
              >
                <span className="w-14 h-14 rounded-full bg-sage-tint flex items-center justify-center shrink-0 text-sage-deep">
                  <ServiceIcon name={service.name} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display text-lg text-sage-deep block">{service.name}</span>
                  <span className="text-sm text-charcoal-soft block mt-1">{serviceSubtitle(service)}</span>
                  <span className="text-sm font-medium text-gold block mt-1">{money(service.base_price_cents)}</span>
                </span>
                <ChevronRight className="w-5 h-5 text-sage-deep shrink-0" aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setConsultationType("help")}
              className="w-full text-left border border-gold rounded-xl px-4 py-4 flex items-center justify-between gap-4 hover:bg-sage-tint/30 transition-colors"
            >
              <span className="w-14 h-14 rounded-full border border-gold/60 flex items-center justify-center shrink-0 text-gold">
                <CircleHelp className="w-7 h-7" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display text-lg text-sage-deep block">Not sure? Help me choose</span>
                <span className="text-sm text-charcoal-soft block mt-1">Talk with Basima before deciding.</span>
              </span>
              <ChevronRight className="w-5 h-5 text-sage-deep shrink-0" aria-hidden="true" />
            </button>
          </div>
          <a href={PHONE_HREF} className="flex items-center justify-center gap-2 mt-7 text-sage-deep underline underline-offset-4">
            <Phone className="w-5 h-5" aria-hidden="true" /> Call or text Basima · {PHONE_DISPLAY}
          </a>
        </section>
      ) : null}

      {step === 2 && selectedService ? (
        <section>
          <BackButton onClick={() => setStep(1)} />
          <h2 className="font-display text-3xl sm:text-4xl text-sage-deep text-center">Tell us about your home</h2>
          <p className="text-center text-charcoal-soft mt-3 mb-7">This helps Basima confirm an accurate price before your visit.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <SelectField label="Home size" value={intake.homeSize} onChange={(value) => setIntake({ ...intake, homeSize: value })} options={["Apartment", "Under 1,000 sq ft", "1,000–2,000 sq ft", "2,000–3,000 sq ft", "3,000–4,000 sq ft", "Over 4,000 sq ft"]} />
            <SelectField label="Bedrooms" value={intake.bedrooms} onChange={(value) => setIntake({ ...intake, bedrooms: value })} options={["Studio", "1", "2", "3", "4", "5+"]} />
            <SelectField label="Bathrooms" value={intake.bathrooms} onChange={(value) => setIntake({ ...intake, bathrooms: value })} options={["1", "1.5", "2", "2.5", "3", "4+"]} />
            <SelectField label="Current condition" value={intake.condition} onChange={(value) => setIntake({ ...intake, condition: value })} options={["Light upkeep", "Typical lived-in", "Needs extra attention", "Heavy buildup"]} />
          </div>

          <fieldset className="mt-7">
            <legend className="font-display text-xl text-sage-deep mb-3">How often would you like cleaning?</legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {frequencies.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRecurrence(item.value)}
                  className={`border rounded-xl py-3 px-2 text-sm transition-colors ${recurrence === item.value ? "bg-sage-deep border-sage-deep text-cream" : "border-line hover:border-sage-deep"}`}
                >
                  <span className="block">{item.label}</span>
                  <span className="block text-[11px] mt-1 opacity-70">{item.detail}</span>
                </button>
              ))}
            </div>
            {recurrence !== "none" ? (
              <p className="text-sm text-charcoal-soft mt-3">
                We’ll request the first visit now. Basima will confirm your continuing schedule with you.
              </p>
            ) : null}
          </fieldset>
          {error ? <ErrorMessage message={error} /> : null}
          <button type="button" disabled={!canContinueHome} onClick={continueToSchedule} className="w-full mt-7 tracked-caps bg-sage-deep text-cream px-7 py-4 rounded-full disabled:opacity-40">
            See Dates & Times
          </button>
        </section>
      ) : null}

      {step === 3 && selectedService ? (
        <section>
          <BackButton onClick={() => setStep(2)} />
          <h2 className="font-display text-3xl sm:text-4xl text-sage-deep text-center">Choose a day</h2>
          <div className="border border-line bg-sage-tint/25 rounded-2xl p-4 mt-6 mb-6 flex items-center gap-4">
            <span className="w-14 h-14 rounded-full bg-cream flex items-center justify-center shrink-0 text-sage-deep">
              <ServiceIcon name={selectedService.name} />
            </span>
            <span>
              <span className="font-display text-lg text-sage-deep block">{selectedService.name}</span>
              <span className="text-gold text-sm block mt-1">{money(selectedService.base_price_cents)}</span>
              <span className="text-xs text-charcoal-soft block mt-1">Final price confirmed before your visit.</span>
            </span>
          </div>

          <p className="tracked-caps text-xs text-charcoal-soft mb-3 flex items-center gap-2"><CalendarDays className="w-4 h-4" aria-hidden="true" /> Available during the next 14 days</p>
          <div className="flex gap-3 overflow-x-auto pb-3 snap-x" aria-label="Choose a date">
            {days.map((day) => {
              const key = dateKey(day);
              const slots = availability[key];
              const unavailable = !loadingAvailability && slots?.length === 0;
              const active = selectedDateKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={loadingAvailability || unavailable}
                  onClick={() => {
                    setSelectedDateKey(key);
                    setSelectedSlot("");
                  }}
                  className={`shrink-0 w-[82px] snap-start border rounded-xl px-3 py-3 text-center transition-colors ${active ? "bg-sage-deep border-sage-deep text-cream" : unavailable ? "border-line text-charcoal-soft/40" : "border-line hover:border-sage-deep"}`}
                >
                  <span className="tracked-caps text-[11px] block">{day.toLocaleDateString("en-US", { timeZone: TZ, weekday: "short" })}</span>
                  <span className="font-display text-base block mt-1">{day.toLocaleDateString("en-US", { timeZone: TZ, month: "short", day: "numeric" })}</span>
                  <span className="block mt-1 text-xs" aria-hidden="true">{unavailable ? "—" : "●"}</span>
                </button>
              );
            })}
          </div>

          <h3 className="font-display text-xl text-sage-deep mt-6 mb-3">
            {selectedDate ? "Choose a time" : loadingAvailability ? "Finding openings…" : "No openings in the next two weeks"}
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-3 snap-x">
            {selectedSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`shrink-0 min-w-[108px] snap-start border rounded-xl px-4 py-3 transition-colors ${selectedSlot === slot ? "bg-sage-deep border-sage-deep text-cream" : "border-line hover:border-sage-deep"}`}
              >
                {new Date(slot).toLocaleTimeString("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" })}
              </button>
            ))}
          </div>
          <a href={PHONE_HREF} className="block text-center mt-5 text-sage-deep underline underline-offset-4">
            Need another time? Call or text us.
          </a>
          {error ? <ErrorMessage message={error} /> : null}
          <button type="button" disabled={!selectedSlot} onClick={() => setStep(4)} className="w-full mt-7 tracked-caps bg-sage-deep text-cream px-7 py-4 rounded-full disabled:opacity-40">
            Continue
          </button>
        </section>
      ) : null}

      {step === 4 && selectedService && selectedSlot ? (
        <section>
          <BackButton onClick={() => setStep(3)} />
          <h2 className="font-display text-3xl sm:text-4xl text-sage-deep text-center">Review your request</h2>
          <div className="border border-line bg-sage-tint/25 rounded-xl p-5 mt-6 mb-7">
            <p className="font-display text-xl text-sage-deep">{selectedService.name}</p>
            <p className="text-charcoal-soft mt-2">
              {new Date(selectedSlot).toLocaleString("en-US", { timeZone: TZ, weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </p>
            <p className="text-sm text-charcoal-soft mt-1">{intake.bedrooms} bedrooms · {intake.bathrooms} bathrooms · {frequency?.label}</p>
            <p className="text-gold mt-3">{money(selectedService.base_price_cents)}</p>
          </div>

          <form onSubmit={submitBooking} className="space-y-4">
            <TextField label="Full name" value={contact.fullName} onChange={(value) => setContact({ ...contact, fullName: value })} required autoComplete="name" />
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Phone" type="tel" value={contact.phone} onChange={(value) => setContact({ ...contact, phone: value })} required autoComplete="tel" />
              <TextField label="Email (optional)" type="email" value={contact.email} onChange={(value) => setContact({ ...contact, email: value })} autoComplete="email" />
            </div>
            <TextField label="Street address" value={contact.address1} onChange={(value) => setContact({ ...contact, address1: value })} required autoComplete="address-line1" />
            <div className="grid sm:grid-cols-3 gap-4">
              <TextField label="Apt / unit" value={contact.address2} onChange={(value) => setContact({ ...contact, address2: value })} autoComplete="address-line2" />
              <SelectField label="City" value={contact.city} onChange={(value) => setContact({ ...contact, city: value })} options={cityOptions} />
              <TextField label="ZIP code" value={contact.zip} onChange={(value) => setContact({ ...contact, zip: value })} required autoComplete="postal-code" />
            </div>
            <label className="block">
              <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Anything we should know? (optional)</span>
              <textarea value={contact.notes} onChange={(event) => setContact({ ...contact, notes: event.target.value })} className="w-full border border-line rounded-lg px-4 py-3 min-h-24 focus:border-sage-deep outline-none" />
            </label>

            <div className="border-t border-line pt-5 space-y-2 text-sm text-charcoal-soft">
              <p>✓ No payment due today</p>
              <p>✓ Basima will confirm by phone or text</p>
              <p>✓ Final price confirmed before your visit</p>
              {recurrence !== "none" ? <p>✓ Only the first visit is requested today</p> : null}
            </div>
            {error ? <ErrorMessage message={error} /> : null}
            <button disabled={submitting} className="w-full tracked-caps bg-sage-deep text-cream px-7 py-4 rounded-full disabled:opacity-50">
              {submitting ? "Sending Request…" : "Request Booking"}
            </button>
            <p className="text-xs text-center text-charcoal-soft">Your information is used only to arrange your cleaning.</p>
          </form>
        </section>
      ) : null}
    </div>
  );
}

function ConsultationForm({
  type,
  contact,
  setContact,
  submitting,
  error,
  onBack,
  onSubmit,
}: {
  type: "help" | "commercial";
  contact: Contact;
  setContact: (contact: Contact) => void;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <section>
      <BackButton onClick={onBack} />
      <h2 className="font-display text-3xl sm:text-4xl text-sage-deep text-center">
        {type === "commercial" ? "Request a commercial quote" : "Let us help you choose"}
      </h2>
      <p className="text-center text-charcoal-soft mt-3 mb-7">
        Tell us how to reach you. Basima will talk through the space and recommend the right service.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField label="Full name" value={contact.fullName} onChange={(value) => setContact({ ...contact, fullName: value })} required autoComplete="name" />
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Phone" type="tel" value={contact.phone} onChange={(value) => setContact({ ...contact, phone: value })} required autoComplete="tel" />
          <TextField label="Email (optional)" type="email" value={contact.email} onChange={(value) => setContact({ ...contact, email: value })} autoComplete="email" />
        </div>
        <SelectField label="Preferred service area" value={contact.city} onChange={(value) => setContact({ ...contact, city: value })} options={cityOptions} />
        <label className="block">
          <span className="tracked-caps text-xs text-charcoal-soft block mb-1">What would you like help with?</span>
          <textarea required value={contact.notes} onChange={(event) => setContact({ ...contact, notes: event.target.value })} className="w-full border border-line rounded-lg px-4 py-3 min-h-28 focus:border-sage-deep outline-none" placeholder={type === "commercial" ? "Business type, approximate size, preferred frequency…" : "Tell us about your home or what you would like cleaned…"} />
        </label>
        {error ? <ErrorMessage message={error} /> : null}
        <button disabled={submitting} className="w-full tracked-caps bg-sage-deep text-cream px-7 py-4 rounded-full disabled:opacity-50">
          {submitting ? "Sending…" : "Ask Basima to Contact Me"}
        </button>
      </form>
      <a href={PHONE_HREF} className="block text-center mt-6 text-sage-deep underline underline-offset-4">
        Prefer to talk now? Call or text {PHONE_DISPLAY}
      </a>
    </section>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="tracked-caps text-xs text-charcoal-soft mb-6 hover:text-sage-deep">← Back</button>;
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="text-red-700 text-sm mt-4" role="alert">{message}</p>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="tracked-caps text-xs text-charcoal-soft block mb-1">{label}</span>
      <select required value={value} onChange={(event) => onChange(event.target.value)} className="w-full border border-line rounded-lg px-4 py-3 bg-cream focus:border-sage-deep outline-none">
        <option value="">Select</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="tracked-caps text-xs text-charcoal-soft block mb-1">{label}</span>
      <input required={required} type={type} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none" />
    </label>
  );
}

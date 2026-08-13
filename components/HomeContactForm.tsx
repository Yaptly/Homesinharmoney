"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function HomeContactForm() {
  const supabase = createClient();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.from("contact_inquiries").insert({
      full_name: form.fullName,
      phone: form.phone || null,
      email: form.email || null,
      message: form.message,
    });
    setSubmitting(false);
    if (error) {
      setError("Something went wrong sending that. Please try calling or texting instead.");
      return;
    }
    setDone(true);

    // fire-and-forget owner notification — don't block the success state on this
    supabase.functions
      .invoke("notify-owner", {
        body: {
          type: "contact",
          full_name: form.fullName,
          phone: form.phone,
          email: form.email,
          message: form.message,
        },
      })
      .catch(() => {
        // inquiry is already saved in the database either way; email is best-effort
      });
  }

  if (done) {
    return (
      <div className="text-center py-10">
        <p className="font-display text-xl text-sage-deep mb-2">Message sent.</p>
        <p className="text-charcoal-soft">Basima will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          placeholder="Your name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className="w-full border border-line rounded-lg px-4 py-3 bg-cream focus:border-sage-deep outline-none"
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-line rounded-lg px-4 py-3 bg-cream focus:border-sage-deep outline-none"
        />
      </div>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border border-line rounded-lg px-4 py-3 bg-cream focus:border-sage-deep outline-none"
      />
      <textarea
        required
        placeholder="What can we help with?"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full border border-line rounded-lg px-4 py-3 bg-cream focus:border-sage-deep outline-none min-h-[110px]"
      />
      {error && <p className="text-red-700 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full tracked-caps bg-sage-deep text-cream px-8 py-4 rounded-full hover:bg-[#324a2c] transition-colors disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

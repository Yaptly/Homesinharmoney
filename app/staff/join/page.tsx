"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { HouseMark } from "@/components/HouseMark";

export default function StaffJoinPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<"form" | "done">("form");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    inviteCode: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    const { error: joinError } = await supabase.rpc("join_as_staff", {
      p_invite_code: form.inviteCode,
      p_full_name: form.fullName,
      p_phone: form.phone,
    });

    setLoading(false);

    if (joinError) {
      setError(
        joinError.message.includes("Invalid invite")
          ? "That invite code isn't right. Check with Basima and try again."
          : joinError.message
      );
      return;
    }

    setStep("done");
  }

  if (step === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-cream">
        <div className="w-full max-w-sm text-center">
          <HouseMark className="w-16 h-16 mx-auto mb-6" />
          <h1 className="font-display text-2xl text-sage-deep mb-4">You're all set, almost.</h1>
          <p className="text-charcoal-soft leading-relaxed">
            Your account was created. Basima just needs to approve you before you can see your
            schedule — she'll get it done shortly. Once approved, log in at{" "}
            <button onClick={() => router.push("/admin/login")} className="underline text-sage-deep">
              this same login page
            </button>
            .
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-cream py-16">
      <div className="w-full max-w-sm text-center">
        <HouseMark className="w-16 h-16 mx-auto mb-6" />
        <h1 className="font-display text-2xl text-sage-deep mb-2">Join the Team</h1>
        <p className="text-charcoal-soft mb-8">Create your account to see your cleaning schedule.</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
            required
            type="email"
            placeholder="Email"
            className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            type="password"
            minLength={6}
            placeholder="Create a password"
            className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            required
            placeholder="Invite code (ask Basima)"
            className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
            value={form.inviteCode}
            onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
          />
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full tracked-caps bg-sage-deep text-cream px-8 py-3.5 rounded-full hover:bg-[#324a2c] transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Join"}
          </button>
        </form>
      </div>
    </main>
  );
}

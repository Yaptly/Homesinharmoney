"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { HouseMark } from "@/components/HouseMark";

type Step = "form" | "confirm-email" | "done";

export default function StaffJoinPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<Step>("form");
  const [completingProfile, setCompletingProfile] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    inviteCode: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCompletingProfile(params.get("complete") === "1");
  }, []);

  async function joinStaffProfile() {
    return supabase.rpc("join_as_staff", {
      p_invite_code: form.inviteCode,
      p_full_name: form.fullName,
      p_phone: form.phone,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (completingProfile) {
      const { error: joinError } = await joinStaffProfile();
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
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/login`,
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(
        signUpError.message.toLowerCase().includes("registered")
          ? "This email already has an account. Use Team Sign In below."
          : signUpError.message
      );
      return;
    }

    if (!data.session) {
      setLoading(false);
      setStep("confirm-email");
      return;
    }

    const { error: joinError } = await joinStaffProfile();
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

  if (step === "confirm-email") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-cream">
        <div className="w-full max-w-sm text-center">
          <HouseMark className="w-16 h-16 mx-auto mb-6" />
          <h1 className="font-display text-2xl text-sage-deep mb-4">Check your email</h1>
          <p className="text-charcoal-soft leading-relaxed mb-6">
            Open the confirmation email we sent you. After confirming, return to Team Sign In
            and use the email and password you just created. We’ll then help you finish joining.
          </p>
          <Link
            href="/admin/login"
            className="inline-block tracked-caps bg-sage-deep text-cream px-7 py-3 rounded-full hover:bg-[#324a2c] transition-colors"
          >
            Team Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (step === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-cream">
        <div className="w-full max-w-sm text-center">
          <HouseMark className="w-16 h-16 mx-auto mb-6" />
          <h1 className="font-display text-2xl text-sage-deep mb-4">You’re all set, almost.</h1>
          <p className="text-charcoal-soft leading-relaxed mb-6">
            Your staff profile was created. Basima just needs to approve it before you can see
            your schedule.
          </p>
          <button
            onClick={() => router.push("/admin/login")}
            className="tracked-caps text-sage-deep underline underline-offset-4"
          >
            Return to Team Sign In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-cream py-16">
      <div className="w-full max-w-sm text-center">
        <HouseMark className="w-16 h-16 mx-auto mb-6" />
        <h1 className="font-display text-2xl text-sage-deep mb-2">
          {completingProfile ? "Finish Joining the Team" : "New Staff Join"}
        </h1>
        <p className="text-charcoal-soft mb-8">
          {completingProfile
            ? "Enter your details and the staff invite code to request access."
            : "Create your account to access your cleaning schedule."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <label className="block">
            <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Full name</span>
            <input
              required
              autoComplete="name"
              className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Phone</span>
            <input
              required
              type="tel"
              autoComplete="tel"
              className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          {!completingProfile && (
            <>
              <label className="block">
                <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Email</span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Create password</span>
                <input
                  required
                  type="password"
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </label>
            </>
          )}
          <label className="block">
            <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Staff invite code</span>
            <input
              required
              autoComplete="off"
              className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
              value={form.inviteCode}
              onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
            />
          </label>
          {error && <p className="text-red-700 text-sm" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full tracked-caps bg-sage-deep text-cream px-8 py-3.5 rounded-full hover:bg-[#324a2c] transition-colors disabled:opacity-60"
          >
            {loading ? "Please wait…" : completingProfile ? "Request Staff Access" : "Create Account"}
          </button>
        </form>
        <p className="text-sm text-charcoal-soft mt-7">
          Already have an account?{" "}
          <Link href="/admin/login" className="text-sage-deep underline underline-offset-4">
            Team Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

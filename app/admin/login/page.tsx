"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { HouseMark } from "@/components/HouseMark";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setError("Incorrect email or password.");
      return;
    }

    const { data: role } = await supabase.rpc("current_staff_role");
    setLoading(false);

    if (role === "owner") {
      router.push("/admin/dashboard");
    } else if (role === "staff") {
      router.push("/staff/schedule");
    } else {
      // A confirmed new hire may be authenticated before their staff profile exists.
      // Keep the session and send them back to finish joining with the invite code.
      router.push("/staff/join?complete=1");
    }
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-cream py-16">
      <div className="w-full max-w-sm text-center">
        <HouseMark className="w-16 h-16 mx-auto mb-6" />
        <h1 className="font-display text-2xl text-sage-deep mb-2">Team Sign In</h1>
        <p className="text-charcoal-soft mb-8">For Homes In Harmony staff and administrators.</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <label className="block">
            <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Email</span>
            <input
              required
              type="email"
              autoComplete="email"
              className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="tracked-caps text-xs text-charcoal-soft block mb-1">Password</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="text-red-700 text-sm" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full tracked-caps bg-sage-deep text-cream px-8 py-3.5 rounded-full hover:bg-[#324a2c] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-line">
          <p className="text-sm text-charcoal-soft mb-3">Joining the team for the first time?</p>
          <Link href="/staff/join" className="tracked-caps text-sm text-sage-deep underline underline-offset-4">
            New Staff Join
          </Link>
        </div>
      </div>
    </main>
  );
}

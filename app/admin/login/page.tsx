"use client";

export const dynamic = "force-dynamic";
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
    setLoading(false);
    if (error) {
      setError("Incorrect email or password.");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-cream">
      <div className="w-full max-w-sm text-center">
        <HouseMark className="w-16 h-16 mx-auto mb-6" />
        <h1 className="font-display text-2xl text-sage-deep mb-8">Admin Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="w-full border border-line rounded-lg px-4 py-3 focus:border-sage-deep outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full tracked-caps bg-sage-deep text-cream px-8 py-3.5 rounded-full hover:bg-[#324a2c] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}

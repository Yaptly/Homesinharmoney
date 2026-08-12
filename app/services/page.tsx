import Link from "next/link";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Cleaning Services & Pricing in Morgantown, WV",
  description:
    "Standard, deep, move-in/move-out, and commercial cleaning in Morgantown, WV. See pricing and book online.",
};

function formatPrice(cents: number | null) {
  if (cents == null) return "Custom quote";
  return `$${(cents / 100).toFixed(0)}`;
}

export const revalidate = 3600;

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-14 pb-10 text-center">
          <p className="tracked-caps text-gold mb-3">Services &amp; Pricing</p>
          <h1 className="font-display text-4xl md:text-5xl text-sage-deep">
            Cleaning services for Morgantown homes and businesses.
          </h1>
          <p className="mt-5 text-charcoal-soft text-lg">
            Starting prices below — final quotes depend on home size and condition.
            Every price includes supplies.
          </p>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-8">
          <div className="divide-y divide-line hairline">
            {(services ?? []).map((s) => (
              <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8">
                <div>
                  <h2 className="font-display text-2xl text-sage-deep">{s.name}</h2>
                  <p className="text-charcoal-soft mt-1 max-w-md">{s.description}</p>
                  <p className="tracked-caps text-charcoal-soft/70 mt-2 text-xs">
                    ~{Math.round(s.duration_minutes / 60 * 10) / 10} hrs
                  </p>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <p className="font-display text-2xl text-gold">
                    {formatPrice(s.base_price_cents)}
                  </p>
                  <Link
                    href="/book"
                    className="tracked-caps bg-sage-deep text-cream px-6 py-3 rounded-full hover:bg-[#324a2c] transition-colors whitespace-nowrap"
                  >
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { BookingFlow } from "@/components/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Cleaning",
  description: "Request residential cleaning in Morgantown, Fairmont, Clarksburg, WV, and nearby communities. See starting prices and choose a time online.",
};

export default async function BookPage() {
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
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-6 text-center">
          <p className="tracked-caps text-gold mb-3">Book Online</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-sage-deep">
            Cleaning that fits your home.
          </h1>
        </section>
        <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
          <BookingFlow services={services ?? []} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

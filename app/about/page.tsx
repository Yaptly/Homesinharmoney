import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HouseMark } from "@/components/HouseMark";

export const metadata: Metadata = {
  title: "About",
  description: "Homes In Harmony LLC — locally owned cleaning company serving Morgantown and North Central WV.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-6 pt-14 pb-20 text-center">
          <HouseMark className="w-24 h-24 mx-auto mb-8" />
          <p className="tracked-caps text-gold mb-3">About Us</p>
          <h1 className="font-display text-4xl md:text-5xl text-sage-deep mb-8">
            Clearing the path to balance.
          </h1>
          <div className="text-charcoal-soft text-lg leading-relaxed space-y-5 text-left">
            <p>
              Homes In Harmony LLC is a locally owned cleaning company serving Morgantown
              and North Central West Virginia. We started with a simple belief: a clean,
              organized space makes everything else in life a little easier.
            </p>
            <p>
              Basima Binion founded Homes In Harmony to bring reliable, trustworthy, and
              genuinely careful cleaning to homes and businesses across the area — the kind
              of service where you know exactly who is coming, when, and what to expect.
            </p>
            <p>
              Whether it's a standard visit to keep things tidy, a deep clean to reset a
              space, or a move-in/move-out clean for a fresh start, our approach stays the
              same: dependable people, consistent quality, and respect for every home we
              step into.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

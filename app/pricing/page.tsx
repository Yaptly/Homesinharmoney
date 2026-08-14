import Link from "next/link";
import type { Metadata } from "next";
import { Check, ChevronRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "House Cleaning Pricing | North Central West Virginia",
  description:
    "Understand starting prices for home, deep, move-in/move-out, and commercial cleaning in Morgantown, Fairmont, Clarksburg, and nearby communities.",
  alternates: { canonical: "/pricing" },
};

const prices = [
  {
    name: "Standard Home Cleaning",
    price: "Starting at $150",
    detail: "Routine upkeep for a home that is already maintained.",
  },
  {
    name: "Deep Cleaning",
    price: "Starting at $300",
    detail: "A detailed first visit or reset for a home needing extra attention.",
  },
  {
    name: "Move-In / Move-Out",
    price: "Starting at $320",
    detail: "A thorough cleaning for an empty home before or after a move.",
  },
  {
    name: "Commercial Cleaning",
    price: "Custom quote",
    detail: "Pricing based on the space, cleaning scope, and preferred frequency.",
  },
];

const priceFactors = [
  "Square footage and layout",
  "Number of bedrooms and bathrooms",
  "Current condition and buildup",
  "One-time or recurring frequency",
  "Special requests or extra-detail areas",
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-14 pb-20 sm:pt-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="tracked-caps text-gold mb-3">Pricing Structure</p>
            <h1 className="font-display text-4xl sm:text-5xl text-sage-deep">
              Clear starting prices, tailored to your home.
            </h1>
            <p className="mt-5 text-charcoal-soft text-lg leading-relaxed">
              A 1,000-square-foot apartment and a 4,000-square-foot home require different
              time and care. These starting prices help you plan; Basima confirms your final
              price before the visit.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            {prices.map((item) => (
              <div key={item.name} className="border border-line rounded-2xl p-6">
                <h2 className="font-display text-2xl text-sage-deep">{item.name}</h2>
                <p className="font-display text-xl text-gold mt-3">{item.price}</p>
                <p className="text-charcoal-soft mt-2 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>

          <section className="mt-12 border-y border-line py-10">
            <p className="tracked-caps text-gold mb-3">What Shapes Your Estimate</p>
            <h2 className="font-display text-3xl text-sage-deep">The details that affect price</h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mt-6">
              {priceFactors.map((factor) => (
                <p key={factor} className="flex items-start gap-3 text-charcoal-soft">
                  <span className="w-6 h-6 rounded-full bg-sage-tint flex items-center justify-center shrink-0 text-sage-deep">
                    <Check className="w-4 h-4" aria-hidden="true" />
                  </span>
                  {factor}
                </p>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-2xl bg-sage-tint/30 border border-line p-6 sm:p-8">
            <h2 className="font-display text-3xl text-sage-deep">How booking works</h2>
            <ol className="mt-5 space-y-4 text-charcoal-soft">
              <li><strong className="text-sage-deep">1.</strong> Choose the closest cleaning level.</li>
              <li><strong className="text-sage-deep">2.</strong> Tell us your home size, rooms, and condition.</li>
              <li><strong className="text-sage-deep">3.</strong> Request a day and time within the next two weeks.</li>
              <li><strong className="text-sage-deep">4.</strong> Basima reviews the details and confirms the final price and appointment.</li>
            </ol>
            <p className="text-sm text-charcoal-soft mt-5">No payment is due when you submit a request.</p>
          </section>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book" className="inline-flex items-center gap-2 tracked-caps bg-sage-deep text-cream px-7 py-4 rounded-full hover:bg-[#324a2c] transition-colors">
              Start a Booking <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <a href="tel:+13044915175" className="inline-flex items-center gap-2 text-sage-deep underline underline-offset-4">
              <Phone className="w-4 h-4" aria-hidden="true" /> Prefer to talk? Call Basima
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

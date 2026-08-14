import Link from "next/link";
import type { Metadata } from "next";
import { Building2, ChevronRight, House, PackageOpen, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Cleaning Services in Morgantown, Fairmont & Clarksburg, WV",
  description:
    "Explore standard, deep, move-in/move-out, and commercial cleaning across Morgantown, Fairmont, Clarksburg, and the communities between.",
  alternates: { canonical: "/services" },
};

const serviceGuides = [
  {
    href: "/house-cleaning-morgantown-wv",
    label: "Standard Home Cleaning",
    detail: "Reliable upkeep for a comfortable, maintained home.",
    icon: House,
  },
  {
    href: "/deep-cleaning-morgantown-wv",
    label: "Deep Cleaning",
    detail: "A detailed reset for first visits or spaces needing extra care.",
    icon: Sparkles,
  },
  {
    href: "/move-in-move-out-cleaning-morgantown-wv",
    label: "Move-In & Move-Out Cleaning",
    detail: "A thorough empty-home clean for moving day.",
    icon: PackageOpen,
  },
  {
    href: "/commercial-cleaning-morgantown-wv",
    label: "Commercial Cleaning",
    detail: "Flexible cleaning plans built around your workplace.",
    icon: Building2,
  },
];

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-14 pb-20 sm:pt-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="tracked-caps text-gold mb-3">Our Services</p>
            <h1 className="font-display text-4xl sm:text-5xl text-sage-deep">
              Find the right cleaning for your space.
            </h1>
            <p className="mt-5 text-charcoal-soft text-lg leading-relaxed">
              Serving Morgantown, Fairmont, Clarksburg, and the communities between.
              Choose a service to learn what is included.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-10">
            {serviceGuides.map(({ href, label, detail, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group border border-line rounded-2xl p-5 sm:p-6 flex items-center gap-4 hover:border-sage-deep hover:bg-sage-tint/30 transition-colors"
              >
                <span className="w-14 h-14 rounded-full bg-sage-tint flex items-center justify-center shrink-0 text-sage-deep">
                  <Icon className="w-7 h-7" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display text-xl text-sage-deep block">{label}</span>
                  <span className="text-sm text-charcoal-soft leading-relaxed block mt-1">{detail}</span>
                </span>
                <ChevronRight className="w-5 h-5 text-sage-deep shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-gold/60 bg-sage-tint/20 px-6 py-7 text-center">
            <h2 className="font-display text-2xl text-sage-deep">How much will my cleaning cost?</h2>
            <p className="text-charcoal-soft mt-2 max-w-xl mx-auto">
              See our starting prices and the home details that shape your final estimate.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 mt-5 tracked-caps text-sage-deep border border-sage-deep rounded-full px-6 py-3 hover:bg-sage-deep hover:text-cream transition-colors"
            >
              View Pricing Structure <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="text-center mt-8">
            <p className="text-charcoal-soft">Still unsure which service fits?</p>
            <Link href="/book" className="inline-block mt-3 tracked-caps bg-sage-deep text-cream px-7 py-4 rounded-full hover:bg-[#324a2c] transition-colors">
              Let Us Help You Choose
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

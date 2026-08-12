import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Cleaning Service Areas Near Morgantown, WV", description: "Homes In Harmony serves Morgantown, Cheat Lake, Westover, Star City, Suncrest, Brookhaven, Granville, and Fairmont, WV.", alternates: { canonical: "/service-areas" } };

const areas = ["Morgantown", "Cheat Lake", "Westover", "Star City", "Suncrest", "Brookhaven", "Granville", "Fairmont"];

export default function Page() {
  return <><SiteHeader /><main className="flex-1"><section className="max-w-4xl mx-auto px-6 pt-14 pb-16 text-center"><p className="tracked-caps text-gold mb-3">Where We Clean</p><h1 className="font-display text-4xl md:text-5xl text-sage-deep">Cleaning Services Across Morgantown and Nearby WV Communities</h1><p className="mt-6 text-lg text-charcoal-soft leading-relaxed">Our local team provides residential and commercial cleaning throughout the Morgantown area. If you are close to, but outside, the communities below, call or text to confirm availability.</p></section><section className="max-w-4xl mx-auto px-6 pb-20"><div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">{areas.map((area) => <div key={area} className="border border-line rounded-xl p-5 text-center font-display text-lg text-sage-deep">{area}, WV</div>)}</div><div className="mt-14 text-center"><h2 className="font-display text-3xl text-sage-deep">Ready to reclaim your time?</h2><p className="text-charcoal-soft mt-4">Choose a service and request an available cleaning time online.</p><Link href="/book" className="inline-block mt-7 tracked-caps bg-sage-deep text-cream px-8 py-4 rounded-full hover:bg-[#324a2c] transition-colors">Book a Cleaning</Link></div></section></main><SiteFooter /></>;
}

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HouseMark } from "@/components/HouseMark";

const services = [
  {
    name: "Standard Cleaning",
    desc: "Routine upkeep for a home that just needs a refresh — kitchens, baths, floors, dusting.",
  },
  {
    name: "Deep Cleaning",
    desc: "A thorough, top-to-bottom clean. The right starting point for a first visit.",
  },
  {
    name: "Move In / Move Out",
    desc: "Empty-home cleaning so a new chapter starts, or ends, spotless.",
  },
  {
    name: "Commercial Cleaning",
    desc: "Offices and commercial spaces, scoped and scheduled around your hours.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-6 pt-10 pb-20 text-center flex flex-col items-center">
          <HouseMark className="w-40 h-36 md:w-52 md:h-48 mb-8" />
          <p className="tracked-caps text-gold mb-4">Morgantown &amp; North Central WV</p>
          <h1 className="font-display text-4xl md:text-6xl text-sage-deep leading-[1.1] max-w-3xl">
            Clearing the path to balance, one home at a time.
          </h1>
          <p className="mt-6 text-lg text-charcoal-soft max-w-xl">
            Reliable, detail-oriented residential and commercial cleaning — booked online,
            confirmed in minutes, done right every time.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href="/book"
              className="tracked-caps bg-sage-deep text-cream px-8 py-4 rounded-full hover:bg-[#324a2c] transition-colors"
            >
              Book a Cleaning
            </Link>
            <a
              href="tel:+13044915175"
              className="tracked-caps border border-sage-deep text-sage-deep px-8 py-4 rounded-full hover:bg-sage-tint transition-colors"
            >
              Call 304-491-5175
            </a>
          </div>
        </section>

        <div className="hairline max-w-6xl mx-auto" />

        {/* Services */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <p className="tracked-caps text-gold mb-3">What We Offer</p>
            <h2 className="font-display text-3xl md:text-4xl text-sage-deep">Services</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-line">
            {services.map((s) => (
              <div key={s.name} className="bg-cream p-8 md:p-10">
                <h3 className="font-display text-2xl text-sage-deep mb-3">{s.name}</h3>
                <p className="text-charcoal-soft leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="tracked-caps text-sage-deep underline underline-offset-4">
              View full pricing
            </Link>
          </div>
        </section>

        <div className="hairline max-w-6xl mx-auto" />

        {/* Why us */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="tracked-caps text-gold mb-3">We're Looking For The Same Thing You Are</p>
          <h2 className="font-display text-3xl md:text-4xl text-sage-deep mb-8">
            Trustworthy, dependable, detail-oriented.
          </h2>
          <p className="text-charcoal-soft leading-relaxed text-lg">
            Homes In Harmony is built on the same qualities we look for in every person who
            joins the team: reliability, discretion, and genuine care for the spaces we're
            trusted with. Every booking is confirmed, every visit is logged, and every home
            is treated like our own.
          </p>
        </section>

        <div className="hairline max-w-6xl mx-auto" />

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-sage-deep mb-6">
            Ready for a cleaner, calmer home?
          </h2>
          <Link
            href="/book"
            className="inline-block tracked-caps bg-sage-deep text-cream px-8 py-4 rounded-full hover:bg-[#324a2c] transition-colors"
          >
            Check Available Times
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

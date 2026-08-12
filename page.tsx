import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HouseMark } from "@/components/HouseMark";
import { WheatSprig } from "@/components/WheatSprig";
import { Reveal } from "@/components/Reveal";
import { HomeContactForm } from "@/components/HomeContactForm";

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

const trustBadges = [
  {
    label: "Licensed & Insured",
    desc: "Fully insured for your peace of mind, every visit.",
    icon: (
      <path d="M20 4 L34 10 V20 C34 29 28 34.5 20 37 C12 34.5 6 29 6 20 V10 Z M13 20 L18 25 L28 14" />
    ),
  },
  {
    label: "Local & Experienced",
    desc: "Rooted in Morgantown and North Central WV, not a national franchise.",
    icon: <path d="M8 34 V16 L20 6 L32 16 V34 M15 34 V22 H25 V34" />,
  },
  {
    label: "Trustworthy Team",
    desc: "Reliable, detail-oriented cleaners who treat your home like their own.",
    icon: <path d="M20 5 L34 11 V19 C34 28 28 34 20 37 C12 34 6 28 6 19 V11 Z" />,
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 overflow-x-clip">
        {/* Hero */}
        <section className="relative max-w-5xl mx-auto px-6 pt-10 pb-20 text-center flex flex-col items-center">
          <WheatSprig className="hidden md:block absolute left-2 top-16 w-10 h-40 opacity-40 animate-drift" />
          <WheatSprig
            className="hidden md:block absolute right-4 top-28 w-8 h-32 opacity-30 animate-drift"
            strokeColor="var(--sage)"
          />
          <WheatSprig
            className="hidden md:block absolute left-16 bottom-0 w-8 h-28 opacity-25 animate-drift"
            strokeColor="var(--gold-light)"
          />

          <div className="animate-fade-in-up">
            <HouseMark className="w-40 h-36 md:w-52 md:h-48 mb-8" />
          </div>
          <p className="tracked-caps text-gold mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Morgantown &amp; North Central WV
          </p>
          <h1
            className="font-display text-4xl md:text-6xl text-sage-deep leading-[1.1] max-w-3xl animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Clearing the path to balance, one home at a time.
          </h1>
          <p
            className="mt-6 text-lg text-charcoal-soft max-w-xl animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Reliable, insured, and locally trusted residential and commercial cleaning — booked
            online, confirmed in minutes, done right every time.
          </p>
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/book"
              className="tracked-caps bg-sage-deep text-cream px-8 py-4 rounded-full hover:bg-[#324a2c] hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
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

        {/* Trust badges */}
        <Reveal className="max-w-5xl mx-auto px-6 pb-4">
          <div className="grid sm:grid-cols-3 gap-6">
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="border border-line rounded-2xl p-6 text-center hover:border-sage-deep hover:-translate-y-1 transition-all bg-cream"
              >
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  className="w-10 h-10 mx-auto mb-3"
                  stroke="var(--gold)"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                >
                  {b.icon}
                </svg>
                <p className="font-display text-lg text-sage-deep mb-1">{b.label}</p>
                <p className="text-sm text-charcoal-soft">{b.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="hairline max-w-6xl mx-auto mt-16" />

        {/* Services */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <Reveal className="text-center mb-14">
            <p className="tracked-caps text-gold mb-3">What We Offer</p>
            <h2 className="font-display text-3xl md:text-4xl text-sage-deep">Services</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-px bg-line">
            {services.map((s, i) => (
              <Reveal key={s.name} delay={i * 80} className="bg-cream">
                <div className="p-8 md:p-10 h-full hover:bg-sage-tint/40 transition-colors">
                  <h3 className="font-display text-2xl text-sage-deep mb-3">{s.name}</h3>
                  <p className="text-charcoal-soft leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-12">
            <Link href="/services" className="tracked-caps text-sage-deep underline underline-offset-4">
              View full pricing
            </Link>
          </Reveal>
        </section>

        <div className="hairline max-w-6xl mx-auto" />

        {/* Why us */}
        <Reveal className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="tracked-caps text-gold mb-3">We're Looking For The Same Thing You Are</p>
          <h2 className="font-display text-3xl md:text-4xl text-sage-deep mb-8">
            Trustworthy, dependable, detail-oriented.
          </h2>
          <p className="text-charcoal-soft leading-relaxed text-lg">
            Homes In Harmony is built on the same qualities we look for in every person who
            joins the team: reliability, discretion, and genuine care for the spaces we're
            trusted with. Fully insured and experienced across Morgantown and North Central WV,
            every booking is confirmed, every visit is logged, and every home is treated like
            our own.
          </p>
        </Reveal>

        <div className="hairline max-w-6xl mx-auto" />

        {/* Contact */}
        <section className="relative max-w-4xl mx-auto px-6 py-20">
          <WheatSprig
            className="hidden md:block absolute -right-2 top-10 w-9 h-36 opacity-25 animate-drift"
            strokeColor="var(--sage)"
          />
          <Reveal className="text-center mb-12">
            <p className="tracked-caps text-gold mb-3">Get In Touch</p>
            <h2 className="font-display text-3xl md:text-4xl text-sage-deep mb-4">
              Prefer not to call? Send a message.
            </h2>
            <p className="text-charcoal-soft max-w-md mx-auto">
              Fill this out and Basima will get back to you directly — or call/text if you'd
              rather talk it through.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid md:grid-cols-5 gap-10 items-start">
              <div className="md:col-span-3 border border-line rounded-2xl p-6 md:p-8 bg-cream">
                <HomeContactForm />
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="tracked-caps text-charcoal-soft mb-2">Call or Text</p>
                  <a href="tel:+13044915175" className="font-display text-2xl text-sage-deep">
                    304-491-5175
                  </a>
                </div>
                <div>
                  <p className="tracked-caps text-charcoal-soft mb-2">Email</p>
                  <a
                    href="mailto:homesinharmonyllc.wv@gmail.com"
                    className="text-sage-deep break-words"
                  >
                    homesinharmonyllc.wv@gmail.com
                  </a>
                </div>
                <div>
                  <p className="tracked-caps text-charcoal-soft mb-2">Ready to book instead?</p>
                  <Link
                    href="/book"
                    className="inline-block tracked-caps bg-sage-deep text-cream px-6 py-3 rounded-full hover:bg-[#324a2c] transition-colors"
                  >
                    Book a Cleaning
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

type Faq = { question: string; answer: string };

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  canonicalPath: string;
  included: string[];
  idealFor: string[];
  faqs: Faq[];
};

const areas = [
  "Morgantown",
  "Cheat Lake",
  "Westover",
  "Star City",
  "Suncrest",
  "Brookhaven",
  "Granville",
  "Fairmont",
];

export function ServiceLandingPage({
  eyebrow,
  title,
  intro,
  canonicalPath,
  included,
  idealFor,
  faqs,
}: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: title,
        provider: { "@id": "https://homesinharmonyllc.com/#business" },
        url: `https://homesinharmonyllc.com${canonicalPath}`,
        areaServed: areas.map((name) => ({ "@type": "City", name: `${name}, WV` })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://homesinharmonyllc.com" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://homesinharmonyllc.com/services" },
          { "@type": "ListItem", position: 3, name: title, item: `https://homesinharmonyllc.com${canonicalPath}` },
        ],
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <section className="max-w-4xl mx-auto px-6 pt-14 pb-16 text-center">
          <p className="tracked-caps text-gold mb-3">{eyebrow}</p>
          <h1 className="font-display text-4xl md:text-5xl text-sage-deep leading-tight">{title}</h1>
          <p className="mt-6 text-lg text-charcoal-soft max-w-2xl mx-auto leading-relaxed">{intro}</p>
          <div className="mt-9 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/book" className="tracked-caps bg-sage-deep text-cream px-8 py-4 rounded-full hover:bg-[#324a2c] transition-colors">Book a Cleaning</Link>
            <a href="tel:+13044915175" className="tracked-caps border border-sage-deep text-sage-deep px-8 py-4 rounded-full hover:bg-sage-tint transition-colors">Call 304-491-5175</a>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-8">
          <div className="border border-line rounded-2xl p-7">
            <h2 className="font-display text-2xl text-sage-deep mb-5">What&apos;s included</h2>
            <ul className="space-y-3 text-charcoal-soft">
              {included.map((item) => <li key={item}>✓ {item}</li>)}
            </ul>
          </div>
          <div className="border border-line rounded-2xl p-7">
            <h2 className="font-display text-2xl text-sage-deep mb-5">A good fit for</h2>
            <ul className="space-y-3 text-charcoal-soft">
              {idealFor.map((item) => <li key={item}>✓ {item}</li>)}
            </ul>
          </div>
        </section>

        <section className="bg-sage-tint/40">
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <p className="tracked-caps text-gold mb-3">Local &amp; Accountable</p>
            <h2 className="font-display text-3xl text-sage-deep mb-5">Cleaning with peace of mind.</h2>
            <p className="text-charcoal-soft leading-relaxed max-w-2xl mx-auto">
              Homes In Harmony LLC is licensed and insured, uses background-checked staff, and stands behind every visit with a satisfaction guarantee. We serve Morgantown, Cheat Lake, Westover, Star City, Suncrest, Brookhaven, Granville, and Fairmont.
            </p>
            <Link href="/service-areas" className="inline-block mt-6 tracked-caps text-sage-deep underline underline-offset-4">See our service area</Link>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-20">
          <p className="tracked-caps text-gold mb-3 text-center">Common Questions</p>
          <h2 className="font-display text-3xl text-sage-deep mb-10 text-center">Frequently asked questions</h2>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="font-display text-xl text-sage-deep">{faq.question}</h3>
                <p className="text-charcoal-soft mt-2 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

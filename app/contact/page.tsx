import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeContactForm } from "@/components/HomeContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Homes In Harmony LLC — call, text, or send a message to ask a question or book a cleaning.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="max-w-2xl mx-auto px-6 pt-14 pb-6 text-center">
          <p className="tracked-caps text-gold mb-3">Get In Touch</p>
          <h1 className="font-display text-4xl md:text-5xl text-sage-deep mb-6">
            We'd love to hear from you.
          </h1>
          <p className="text-charcoal-soft text-lg mb-10">
            Send a message below and Basima will get back to you directly — or call/text if
            you'd rather talk it through.
          </p>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-10">
          <div className="border border-line rounded-2xl p-6 md:p-8 bg-cream">
            <HomeContactForm />
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <div className="space-y-5 tracked-caps">
            <p>
              <a href="tel:+13044915175" className="text-sage-deep text-xl normal-case tracking-normal font-display">
                304-491-5175
              </a>
            </p>
            <p>
              <a
                href="mailto:homesinharmonyllc.wv@gmail.com"
                className="text-sage-deep normal-case tracking-normal"
              >
                homesinharmonyllc.wv@gmail.com
              </a>
            </p>
          </div>
          <Link
            href="/book"
            className="inline-block mt-10 tracked-caps bg-sage-deep text-cream px-8 py-4 rounded-full hover:bg-[#324a2c] transition-colors"
          >
            Book a Cleaning
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

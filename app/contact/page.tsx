import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Homes In Harmony LLC — call, text, or email to ask a question or book a cleaning.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="max-w-2xl mx-auto px-6 pt-14 pb-24 text-center">
          <p className="tracked-caps text-gold mb-3">Get In Touch</p>
          <h1 className="font-display text-4xl md:text-5xl text-sage-deep mb-8">
            We'd love to hear from you.
          </h1>
          <p className="text-charcoal-soft text-lg mb-10">
            For a free consultation, call or text Basima directly, or send an email.
            Ready to pick a time right now?
          </p>
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
            className="inline-block mt-12 tracked-caps bg-sage-deep text-cream px-8 py-4 rounded-full hover:bg-[#324a2c] transition-colors"
          >
            Book a Cleaning
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

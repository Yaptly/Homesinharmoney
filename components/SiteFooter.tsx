import Link from "next/link";
import { HouseMark } from "./HouseMark";

export function SiteFooter() {
  return (
    <footer className="hairline mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <HouseMark className="w-14 h-14 mb-4" />
          <p className="font-display text-lg text-sage-deep">Homes In Harmony LLC</p>
          <p className="text-sm text-charcoal-soft mt-1 italic">Clearing the Path to Balance</p>
        </div>
        <div className="tracked-caps text-charcoal-soft space-y-3">
          <p className="text-sage-deep">Get in touch</p>
          <p className="normal-case tracking-normal text-base">
            <a href="tel:+13044915175" className="hover:text-sage-deep">304-491-5175</a>
          </p>
          <p className="normal-case tracking-normal text-base">
            <a href="mailto:homesinharmonyllc.wv@gmail.com" className="hover:text-sage-deep">
              homesinharmonyllc.wv@gmail.com
            </a>
          </p>
        </div>
        <div className="tracked-caps text-charcoal-soft space-y-3">
          <p className="text-sage-deep">Serving</p>
          <p className="normal-case tracking-normal text-base">
            Morgantown &amp; North Central WV
          </p>
          <Link href="/book" className="inline-block mt-2 underline underline-offset-4 normal-case tracking-normal">
            Book a cleaning
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-8 text-xs text-charcoal-soft/70">
        © {new Date().getFullYear()} Homes In Harmony LLC. All rights reserved.
      </div>
    </footer>
  );
}

import Link from "next/link";
import { HouseMark } from "./HouseMark";

export function SiteFooter() {
  return (
    <footer className="hairline mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <HouseMark className="w-14 h-14 mb-4" />
          <p className="font-display text-lg text-sage-deep">Homes In Harmony LLC</p>
          <p className="text-sm text-charcoal-soft mt-1 italic">Clearing the Path to Balance</p>
        </div>
        <div className="text-charcoal-soft space-y-3">
          <p className="tracked-caps text-sage-deep">Services</p>
          <p><Link href="/house-cleaning-morgantown-wv">House cleaning</Link></p>
          <p><Link href="/deep-cleaning-morgantown-wv">Deep cleaning</Link></p>
          <p><Link href="/move-in-move-out-cleaning-morgantown-wv">Move cleaning</Link></p>
          <p><Link href="/commercial-cleaning-morgantown-wv">Commercial cleaning</Link></p>
          <p><Link href="/pricing" className="underline underline-offset-4">Pricing structure</Link></p>
        </div>
        <div className="text-charcoal-soft space-y-3">
          <p className="tracked-caps text-sage-deep">Get in touch</p>
          <p><a href="tel:+13044915175">304-491-5175</a></p>
          <p className="break-words"><a href="mailto:homesinharmonyllc.wv@gmail.com">homesinharmonyllc.wv@gmail.com</a></p>
          <p><Link href="/book" className="underline underline-offset-4">Book a cleaning</Link></p>
        </div>
        <div className="text-charcoal-soft space-y-3">
          <p className="tracked-caps text-sage-deep">Serving</p>
          <p>Morgantown, Clarksburg, Fairmont &amp; everywhere between, WV</p>
          <p><Link href="/service-areas" className="underline underline-offset-4">View service area</Link></p>
        </div>
        <div className="text-charcoal-soft space-y-3">
          <p className="tracked-caps text-sage-deep">Team Access</p>
          <p><Link href="/admin/login" className="underline underline-offset-4">Staff &amp; admin sign in</Link></p>
          <p><Link href="/staff/join" className="underline underline-offset-4">New staff join</Link></p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-8 text-xs text-charcoal-soft/70">
        © {new Date().getFullYear()} Homes In Harmony LLC. All rights reserved.
      </div>
    </footer>
  );
}

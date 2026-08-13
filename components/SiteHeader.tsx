import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-3">
        <Link href="/" className="font-display text-lg sm:text-xl text-sage-deep tracking-tight">
          Homes In Harmony
        </Link>
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7 tracked-caps text-charcoal-soft">
          <Link href="/services" className="hover:text-sage-deep transition-colors">Services</Link>
          <Link href="/service-areas" className="hover:text-sage-deep transition-colors">Service Areas</Link>
          <Link href="/about" className="hover:text-sage-deep transition-colors">About</Link>
          <Link href="/contact" className="hover:text-sage-deep transition-colors">Contact</Link>
        </nav>
        <Link
          href="/book"
          className="shrink-0 tracked-caps text-xs sm:text-sm bg-sage-deep text-cream px-4 sm:px-5 py-2.5 sm:py-3 rounded-full hover:bg-[#324a2c] transition-colors"
        >
          Book Now
        </Link>
      </div>
      <nav
        aria-label="Mobile navigation"
        className="md:hidden px-4 sm:px-6 pb-4 flex flex-wrap justify-center gap-x-5 gap-y-2 tracked-caps text-charcoal-soft text-xs"
      >
        <Link href="/services">Services</Link>
        <Link href="/service-areas">Areas</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}

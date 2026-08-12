import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="w-full">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-sage-deep tracking-tight">
          Homes In Harmony
        </Link>
        <nav className="hidden md:flex items-center gap-8 tracked-caps text-charcoal-soft">
          <Link href="/services" className="hover:text-sage-deep transition-colors">Services</Link>
          <Link href="/about" className="hover:text-sage-deep transition-colors">About</Link>
          <Link href="/contact" className="hover:text-sage-deep transition-colors">Contact</Link>
        </nav>
        <Link
          href="/book"
          className="tracked-caps bg-sage-deep text-cream px-5 py-3 rounded-full hover:bg-[#324a2c] transition-colors"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}

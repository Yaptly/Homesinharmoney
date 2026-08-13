import type { Metadata } from "next";
import "./globals.css";

const baseUrl = "https://homesinharmonyllc.com";
const areas = ["Morgantown", "Clarksburg", "Fairmont"];

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "House Cleaning Morgantown, WV | Homes In Harmony LLC",
    template: "%s | Homes In Harmony LLC",
  },
  description:
    "Licensed and insured house cleaning in Morgantown, WV and nearby communities. A satisfaction guarantee and easy online booking.",
  alternates: { canonical: "/" },
  category: "House cleaning service",
  openGraph: {
    title: "House Cleaning in Morgantown, WV | Homes In Harmony LLC",
    description:
      "Residential and commercial cleaning from a licensed, insured local team with a satisfaction guarantee.",
    url: baseUrl,
    siteName: "Homes In Harmony LLC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "House Cleaning in Morgantown, WV | Homes In Harmony LLC",
    description: "Licensed and insured local cleaning for Morgantown and nearby communities.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HousekeepingService",
  "@id": `${baseUrl}/#business`,
  name: "Homes In Harmony LLC",
  url: baseUrl,
  description:
    "Licensed and insured residential and commercial cleaning with a satisfaction guarantee.",
  telephone: "+1-304-491-5175",
  email: "homesinharmonyllc.wv@gmail.com",
  priceRange: "$$",
  areaServed: areas.map((name) => ({ "@type": "City", name: `${name}, WV` })),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Morgantown",
    addressRegion: "WV",
    addressCountry: "US",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cleaning Services",
    itemListElement: [
      "House Cleaning",
      "Deep Cleaning",
      "Move-In and Move-Out Cleaning",
      "Recurring Cleaning",
      "Commercial Cleaning",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

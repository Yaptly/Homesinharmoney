import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://homesinharmonyllc.com"),
  title: {
    default: "Homes In Harmony LLC | House Cleaning in Morgantown, WV",
    template: "%s | Homes In Harmony LLC",
  },
  description:
    "Residential and commercial cleaning in Morgantown and North Central West Virginia. Standard, deep, move-in/move-out, and recurring cleaning. Book online in minutes.",
  keywords: [
    "house cleaning Morgantown WV",
    "residential cleaning North Central WV",
    "commercial cleaning Morgantown",
    "recurring cleaning service WV",
    "move out cleaning Morgantown",
  ],
  openGraph: {
    title: "Homes In Harmony LLC | House Cleaning in Morgantown, WV",
    description:
      "Clearing the path to balance — residential & commercial cleaning across Morgantown and North Central WV.",
    url: "https://homesinharmonyllc.com",
    siteName: "Homes In Harmony LLC",
    locale: "en_US",
    type: "website",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HousekeepingService",
  name: "Homes In Harmony LLC",
  description:
    "Residential and commercial cleaning serving Morgantown and North Central West Virginia.",
  telephone: "+1-304-491-5175",
  email: "homesinharmonyllc.wv@gmail.com",
  areaServed: {
    "@type": "City",
    name: "Morgantown, WV",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Morgantown",
    addressRegion: "WV",
    addressCountry: "US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

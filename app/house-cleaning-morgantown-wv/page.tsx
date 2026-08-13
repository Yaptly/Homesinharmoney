import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "House Cleaning Morgantown, WV",
  description: "Reliable house cleaning in Morgantown, WV from licensed and insured professionals. One-time and recurring visits available.",
  alternates: { canonical: "/house-cleaning-morgantown-wv" },
};

export default function Page() {
  return <ServiceLandingPage eyebrow="Residential Cleaning" title="House Cleaning Services in Morgantown, WV" canonicalPath="/house-cleaning-morgantown-wv" intro="Come home to a space that feels calm, cared for, and ready to enjoy. Homes In Harmony provides dependable residential cleaning throughout Morgantown and nearby North Central West Virginia communities." included={["Kitchen surfaces, sinks, and appliance exteriors", "Bathrooms, mirrors, fixtures, and toilets", "Dusting of reachable surfaces and furnishings", "Vacuuming and mopping throughout the home", "Trash removal and final detail check"]} idealFor={["Busy households that need dependable upkeep", "One-time resets before guests or special occasions", "Weekly, biweekly, or monthly cleaning", "Homeowners who value a consistent, trustworthy team"]} faqs={[{ question: "Do you bring cleaning supplies?", answer: "Yes. Standard supplies are included. Tell us in advance about allergies, delicate surfaces, pets, or preferred products." }, { question: "Do I need to be home?", answer: "No. Access instructions can be arranged when your appointment is confirmed." }, { question: "How is the final price determined?", answer: "Online prices are starting points. The final quote depends on the size, condition, and needs of your home." }, { question: "What if something is missed?", answer: "Contact us promptly after your visit. Our satisfaction guarantee means we will work with you to make it right." }]} />;
}

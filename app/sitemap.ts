import type { MetadataRoute } from "next";

const base = "https://homesinharmonyllc.com";
const lastModified = new Date("2026-08-12");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/house-cleaning-morgantown-wv", priority: 0.9 },
    { path: "/deep-cleaning-morgantown-wv", priority: 0.8 },
    { path: "/move-in-move-out-cleaning-morgantown-wv", priority: 0.8 },
    { path: "/commercial-cleaning-morgantown-wv", priority: 0.8 },
    { path: "/service-areas", priority: 0.8 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/book", priority: 0.7 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority,
  }));
}

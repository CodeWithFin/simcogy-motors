import { MetadataRoute } from "next";
import { getPublishedCars } from "@/lib/cars";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/cars`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/trade-in`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let carUrls: MetadataRoute.Sitemap = [];
  try {
    const { cars } = await getPublishedCars({ limit: 1000 });
    carUrls = cars.map((car) => ({
      url: `${siteUrl}/cars/${car.slug}`,
      lastModified: car.updated_at ? new Date(car.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable - skip dynamic car URLs
  }

  return [...staticPages, ...carUrls];
}
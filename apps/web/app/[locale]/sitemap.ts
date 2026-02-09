import type { MetadataRoute } from "next";

// Définissez vos langues supportées
const locales = ['en']; 
// Définissez vos pages statiques réelles
const pages = ["", "get-certified","about", "contact", "whitepaper"]; 

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://humartz.com";

  // On génère une entrée pour chaque page dans chaque langue
  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page ? `/${page}` : ""}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );
}
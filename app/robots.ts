import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** robots.txt généré automatiquement */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/premium", "/rappels-entretien/confirmation"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

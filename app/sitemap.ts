import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { problems } from "@/lib/troubleshooting";
import { getAllArticles } from "@/lib/blog";
import { calculators } from "@/lib/calculators";
import { departmentSlug, electricianService } from "@/config/serviceArea";

/** sitemap.xml généré automatiquement au build : toute nouvelle page de contenu y apparaît */
export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string) => `${siteConfig.url}${path}`;
  type Freq = "weekly" | "monthly" | "yearly";

  const staticPages: Array<{ path: string; priority: number; changeFrequency: Freq }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/analyse-eau", priority: 0.9, changeFrequency: "monthly" },
    { path: "/depannage", priority: 0.9, changeFrequency: "monthly" },
    { path: "/calculateurs", priority: 0.8, changeFrequency: "monthly" },
    { path: "/guide-electrique", priority: 0.8, changeFrequency: "monthly" },
    { path: "/calendrier-entretien", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/trouver-un-professionnel", priority: 0.7, changeFrequency: "monthly" },
    { path: "/rappels-entretien", priority: 0.5, changeFrequency: "yearly" },
    { path: "/a-propos", priority: 0.4, changeFrequency: "yearly" },
    { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
    { path: "/confidentialite", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
    { path: "/transparence-affiliation", priority: 0.2, changeFrequency: "yearly" },
  ];

  const electrician = electricianService.enabled
    ? [
        { url: u("/electricien-piscine"), changeFrequency: "monthly" as const, priority: 0.7 },
        ...electricianService.departments.map((d) => ({
          url: u(`/electricien-piscine/${departmentSlug(d)}`),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
      ]
    : [];

  return [
    ...staticPages.map((p) => ({ url: u(p.path), changeFrequency: p.changeFrequency, priority: p.priority })),
    ...calculators.map((c) => ({ url: u(`/calculateurs/${c.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...problems.map((p) => ({ url: u(`/depannage/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...getAllArticles().map((a) => ({
      url: u(`/blog/${a.slug}`),
      lastModified: new Date(`${a.updated ?? a.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...electrician,
  ];
}

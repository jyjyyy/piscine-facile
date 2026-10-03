import { siteConfig } from "@/config/site";
import { getAllArticles } from "@/lib/blog";

/** Flux RSS des guides, généré au build */
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getAllArticles()
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${siteConfig.url}/blog/${a.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${a.slug}</guid>
      <description>${esc(a.description)}</description>
      <category>${esc(a.category)}</category>
      <pubDate>${new Date(`${a.date}T08:00:00Z`).toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteConfig.name)} – Guides</title>
    <link>${siteConfig.url}/blog</link>
    <description>${esc(siteConfig.description)}</description>
    <language>fr-FR</language>
    <atom:link href="${siteConfig.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} – ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
  },
  // Flux RSS des guides (découverte des nouveaux articles par les agrégateurs)
  alternates: {
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: `${siteConfig.name} – Guides` }] },
  },
  // Vérification Google Search Console / Bing (variables d'environnement facultatives)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#1d62d8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteConfig.name,
              url: siteConfig.url,
              inLanguage: "fr-FR",
              description: siteConfig.description,
              publisher: { "@id": `${siteConfig.url}/#organisation` },
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${siteConfig.url}/#organisation`,
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/icon.svg`,
              email: siteConfig.contactEmail,
            },
          ]}
        />
        <Header />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}

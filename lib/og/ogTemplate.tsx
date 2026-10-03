import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

/**
 * Modèle d'image de partage (Open Graph) : titre sur dégradé bleu/turquoise.
 * Utilisé par les fichiers opengraph-image.tsx (accueil, articles, dépannage).
 */
export function renderOgImage(title: string, kicker: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #1e50af 0%, #1d62d8 45%, #06c4b1 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, fontWeight: 700 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <path d="M16 2C16 2 5 14 5 20.5a11 11 0 0 0 22 0C27 14 16 2 16 2Z" fill="white" />
            <path d="M8.5 21c2-1.6 3.8-1.6 5.8 0s3.8 1.6 5.8 0 2.6-1.3 3.4-.7" fill="none" stroke="#1d62d8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 30, opacity: 0.9, textTransform: "uppercase", letterSpacing: 2 }}>{kicker}</div>
          <div style={{ fontSize: title.length > 60 ? 58 : 68, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        </div>
        <div style={{ fontSize: 28, opacity: 0.9 }}>{siteConfig.tagline}</div>
      </div>
    ),
    ogSize,
  );
}

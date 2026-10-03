import { renderOgImage, ogSize } from "@/lib/og/ogTemplate";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} – entretien et dépannage de piscine`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage("Votre piscine a un problème ? La solution en 2 minutes", "Outils gratuits pour votre piscine");
}

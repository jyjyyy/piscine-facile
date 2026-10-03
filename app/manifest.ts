import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** Manifeste web : permet d'« installer » le site sur l'écran d'accueil du téléphone */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1d62d8",
    lang: "fr",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

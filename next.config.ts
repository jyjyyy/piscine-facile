import type { NextConfig } from "next";

/**
 * Configuration Next.js.
 * Le site est majoritairement statique (SSG) : aucune option spéciale n'est requise
 * pour un déploiement sur Vercel.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;

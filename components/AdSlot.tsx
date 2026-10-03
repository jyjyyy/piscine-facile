import { siteConfig } from "@/config/site";

/**
 * Emplacement publicitaire.
 * Désactivé par défaut (siteConfig.features.ads = false) : ne rend rien.
 * Une fois activé, intégrez ici le code de votre régie, en le conditionnant
 * au consentement "ads" (voir lib/consent.ts).
 */
export function AdSlot({ label = "Publicité" }: { label?: string }) {
  if (!siteConfig.features.ads) return null;
  return (
    <aside
      aria-label={label}
      className="my-8 flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500"
    >
      {label}
    </aside>
  );
}

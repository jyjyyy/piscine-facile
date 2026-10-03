import Link from "next/link";
import { Info } from "lucide-react";

/** Mention d'affiliation, à placer sur chaque page contenant des liens affiliés */
export function AffiliateDisclosure({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-700 ${className}`}>
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        Cette page contient des liens affiliés : si vous achetez via ces liens, nous pouvons percevoir une
        commission, sans surcoût pour vous. Cela n&apos;influence pas nos conseils.{" "}
        <Link href="/transparence-affiliation" className="font-medium text-eau-700 underline">
          En savoir plus
        </Link>
      </span>
    </p>
  );
}

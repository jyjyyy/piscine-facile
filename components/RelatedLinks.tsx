import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Bloc de liens internes (maillage) */
export function RelatedLinks({ title = "À lire aussi", links }: { title?: string; links: Array<{ href: string; label: string }> }) {
  if (links.length === 0) return null;
  return (
    <nav aria-label={title} className="rounded-2xl border border-eau-100 bg-eau-50/50 p-5">
      <h2 className="font-semibold text-eau-950">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex items-center gap-2 text-sm font-medium text-eau-800 hover:underline">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

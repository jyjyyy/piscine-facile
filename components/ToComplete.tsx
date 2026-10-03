import type { ReactNode } from "react";

/** Marqueur visible d'une information à compléter (mentions légales, etc.) */
export function ToComplete({ children }: { children: ReactNode }) {
  return <mark className="rounded bg-amber-100 px-1 font-medium text-amber-900">[À compléter : {children}]</mark>;
}

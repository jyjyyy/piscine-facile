import type { ReactNode } from "react";
import { Waves } from "@/components/illustrations/Waves";

/** Bandeau de titre en dégradé bleu, utilisé en haut des pages */
export function PageHeader({ title, intro, children }: { title: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-eau-800 via-eau-700 to-turquoise-600 text-white">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:pt-14">
        <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-base text-eau-50 sm:text-lg">{intro}</p>}
        {children}
      </div>
      <Waves className="absolute inset-x-0 bottom-0 h-10 w-full text-white" />
    </section>
  );
}

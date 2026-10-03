import { JsonLd } from "@/components/JsonLd";

/** FAQ visible (accordéons) + données structurées FAQPage */
export function FaqSection({ faq, title = "Questions fréquentes" }: { faq: Array<{ q: string; a: string }>; title?: string }) {
  if (faq.length === 0) return null;
  return (
    <section aria-labelledby="faq-titre" className="max-w-3xl">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <h2 id="faq-titre" className="text-xl font-bold text-eau-950">
        {title}
      </h2>
      <div className="mt-4 space-y-3">
        {faq.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-4 open:border-eau-200">
            <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:hidden">
              <span className="mr-2 inline-block text-turquoise-600 transition-transform group-open:rotate-90" aria-hidden="true">
                ›
              </span>
              {f.q}
            </summary>
            <p className="mt-2 text-slate-700">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

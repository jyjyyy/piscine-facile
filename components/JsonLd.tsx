type JsonLdObject = Record<string, unknown>;

/**
 * Injecte des données structurées JSON-LD (schema.org) dans la page.
 *
 * - Un objet seul est publié tel quel.
 * - Plusieurs objets sont regroupés dans un objet unique { "@context", "@graph": [...] } :
 *   c'est la forme la plus compatible (Google, Bing, extensions et outils qui lisent
 *   obligatoirement "@context" à la racine).
 * Les caractères "<" sont échappés pour éviter toute injection de balise.
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const payload: JsonLdObject = Array.isArray(data)
    ? {
        "@context": "https://schema.org",
        // Le contexte est porté par la racine : on le retire des éléments du graphe
        "@graph": data.map((item) => {
          const rest = { ...item };
          delete rest["@context"];
          return rest;
        }),
      }
    : { "@context": "https://schema.org", ...data };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }}
    />
  );
}

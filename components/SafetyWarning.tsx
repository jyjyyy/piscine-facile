import { ShieldAlert } from "lucide-react";

/** Consignes de sécurité pour la manipulation des produits chimiques */
export function SafetyWarning() {
  return (
    <aside
      aria-label="Consignes de sécurité"
      className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 text-amber-950"
    >
      <p className="flex items-center gap-2 font-bold">
        <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        Sécurité : à lire avant de manipuler un produit
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
        <li>
          <strong>Ne mélangez jamais</strong> un produit chloré avec un produit acide (pH moins, acide) : risque de
          dégagement de gaz chloré toxique.
        </li>
        <li>
          Versez <strong>toujours le produit dans l&apos;eau</strong>, jamais l&apos;eau sur le produit.
        </li>
        <li>
          Portez des <strong>gants et des lunettes</strong> de protection.
        </li>
        <li>
          Stockez les produits <strong>hors de portée des enfants</strong>, au sec, dans leur emballage d&apos;origine.
        </li>
        <li>Espacez les ajouts de produits différents d&apos;au moins quelques heures, filtration en marche.</li>
      </ul>
    </aside>
  );
}

/** Encadré électricité : renvoi systématique vers un électricien qualifié */
export function ElectricalWarning() {
  return (
    <aside aria-label="Avertissement électrique" className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 text-red-950">
      <p className="flex items-center gap-2 font-bold">
        <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        Danger électrique
      </p>
      <p className="mt-2 text-sm">
        Eau et électricité forment un mélange mortel. N&apos;ouvrez pas le coffret électrique et n&apos;intervenez pas
        sur le câblage : toute intervention doit être réalisée par un <strong>électricien qualifié</strong>.
      </p>
    </aside>
  );
}

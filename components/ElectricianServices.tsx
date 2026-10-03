import { Cable, Gauge, Lightbulb, Plug, ShieldCheck, Thermometer, Zap, Wrench } from "lucide-react";

/** Liste des prestations électriques autour de la piscine */
export const electricalServices = [
  { icon: ShieldCheck, title: "Mise en conformité NF C 15-100", text: "Diagnostic de l'installation existante, volumes de sécurité, différentiel 30 mA, liaison équipotentielle." },
  { icon: Zap, title: "Disjoncteur ou différentiel qui saute", text: "Recherche de défaut d'isolement (pompe, projecteur, câble), mesures et réparation." },
  { icon: Wrench, title: "Coffret de filtration", text: "Remplacement ou création du coffret : protection, contacteur, horloge, protection moteur." },
  { icon: Lightbulb, title: "Éclairage de piscine", text: "Projecteurs LED en très basse tension 12 V, transformateur de sécurité hors des volumes." },
  { icon: Thermometer, title: "Raccordement pompe à chaleur", text: "Circuit dédié, protection et différentiel adaptés aux préconisations du fabricant." },
  { icon: Gauge, title: "Électrolyseur et régulation", text: "Raccordement des électrolyseurs, régulateurs de pH et asservissement à la filtration." },
  { icon: Cable, title: "Alimentation du local technique", text: "Liaison depuis le tableau de la maison, câble enterré sous fourreau, protections adaptées." },
  { icon: Plug, title: "Prises et éclairage extérieurs", text: "Prises de terrasse, éclairage de plage et de jardin, conformes aux volumes de sécurité." },
];

export function ElectricianServices() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {electricalServices.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex gap-3 rounded-2xl border border-eau-100 bg-white p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-eau-50 text-eau-700">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-semibold text-eau-950">{title}</span>
            <span className="mt-0.5 block text-sm text-slate-700">{text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

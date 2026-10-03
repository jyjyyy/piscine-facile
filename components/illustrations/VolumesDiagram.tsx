/**
 * Schéma en coupe des volumes 0, 1 et 2 d'une piscine (NF C 15-100, partie 7-702).
 * Schéma pédagogique, non à l'échelle.
 */
export function VolumesDiagram() {
  return (
    <figure className="rounded-2xl border border-eau-100 bg-white p-4">
      <svg viewBox="0 0 640 300" className="h-auto w-full" role="img" aria-labelledby="vol-title vol-desc">
        <title id="vol-title">Volumes de sécurité autour d&apos;une piscine</title>
        <desc id="vol-desc">
          Le volume 0 est l&apos;intérieur du bassin. Le volume 1 s&apos;étend jusqu&apos;à 2 mètres du bord et 2,5 mètres de
          hauteur. Le volume 2 s&apos;étend 1,5 mètre au-delà du volume 1, soit jusqu&apos;à 3,5 mètres du bord.
        </desc>
        {/* Volume 2 (gauche et droite) */}
        <rect x="20" y="40" width="75" height="150" fill="#fef3c7" />
        <rect x="545" y="40" width="75" height="150" fill="#fef3c7" />
        {/* Volume 1 */}
        <rect x="95" y="40" width="100" height="150" fill="#bfe2fe" />
        <rect x="445" y="40" width="100" height="150" fill="#bfe2fe" />
        <rect x="195" y="40" width="250" height="150" fill="#bfe2fe" />
        {/* Sol */}
        <line x1="10" y1="190" x2="630" y2="190" stroke="#475569" strokeWidth="3" />
        {/* Volume 0 : bassin */}
        <path d="M195 190 V270 H445 V190 Z" fill="#2578eb" />
        <text x="320" y="238" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700">Volume 0</text>
        <text x="320" y="120" textAnchor="middle" fill="#172c54" fontSize="18" fontWeight="700">Volume 1</text>
        <text x="57" y="120" textAnchor="middle" fill="#78350f" fontSize="14" fontWeight="700">Vol. 2</text>
        <text x="583" y="120" textAnchor="middle" fill="#78350f" fontSize="14" fontWeight="700">Vol. 2</text>
        {/* Cotes */}
        <g stroke="#334155" strokeWidth="1.5" fill="#334155" fontSize="13">
          <line x1="445" y1="210" x2="545" y2="210" />
          <text x="495" y="228" textAnchor="middle" stroke="none">2 m</text>
          <line x1="545" y1="210" x2="620" y2="210" />
          <text x="583" y="228" textAnchor="middle" stroke="none">1,5 m</text>
          <line x1="630" y1="40" x2="630" y2="190" />
          <text x="624" y="32" textAnchor="end" stroke="none">hauteur 2,5 m</text>
        </g>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-slate-600">
        Schéma de principe en coupe, non à l&apos;échelle. Les volumes sont délimités à partir du bord du bassin.
      </figcaption>
    </figure>
  );
}

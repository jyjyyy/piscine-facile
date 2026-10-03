/** Illustration d'un bassin vu en coupe (SVG maison, aucune image externe) */
export function PoolIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-label="Illustration d'une piscine">
      <defs>
        <linearGradient id="pf-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#53f5dd" />
          <stop offset="1" stopColor="#2578eb" />
        </linearGradient>
      </defs>
      {/* Plage */}
      <rect x="10" y="70" width="380" height="180" rx="28" fill="#f1f5f9" />
      {/* Bassin */}
      <rect x="40" y="95" width="320" height="130" rx="18" fill="url(#pf-water)" />
      {/* Reflets */}
      <path d="M70 130c20-8 40-8 60 0s40 8 60 0" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".7" />
      <path d="M170 175c20-8 40-8 60 0s40 8 60 0" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".55" />
      <path d="M90 200c15-6 30-6 45 0" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".45" />
      {/* Échelle */}
      <path d="M318 60v70M340 60v70" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M318 60c0-14 22-14 22 0" stroke="#94a3b8" strokeWidth="6" fill="none" />
      <path d="M318 100h22M318 120h22" stroke="#94a3b8" strokeWidth="5" />
      {/* Soleil */}
      <circle cx="60" cy="38" r="20" fill="#fcd34d" />
      {/* Bouée */}
      <circle cx="140" cy="160" r="20" fill="none" stroke="#fb7185" strokeWidth="12" />
      <circle cx="140" cy="160" r="20" fill="none" stroke="#fff" strokeWidth="12" strokeDasharray="15.7 15.7" />
    </svg>
  );
}
